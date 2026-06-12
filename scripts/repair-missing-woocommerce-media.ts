/**
 * Réparation sûre — MediaAsset actifs dont le fichier est manquant sous UPLOADS_DIR.
 * Usage :
 *   pnpm tsx scripts/repair-missing-woocommerce-media.ts            (dry-run, aucun changement)
 *   pnpm tsx scripts/repair-missing-woocommerce-media.ts --apply    (applique les actions sûres)
 *
 * Règles :
 * - aucun fichier supprimé, déplacé ou écrit ;
 * - correction de storageKey uniquement si UN SEUL fichier équivalent est retrouvé
 *   (par checksum sha256, sinon par nom de fichier exact) et que la clé cible est libre ;
 * - archivage uniquement des assets manquants NON référencés (aucune relation d'usage) ;
 * - assets référencés sans équivalent → rapport "action manuelle requise", aucune mutation ;
 * - assets déjà archivés → jamais touchés ;
 * - idempotent : relancer le script ne refait rien si tout est déjà traité.
 *
 * Exit code : 0 si plus aucun cas manuel restant ; 1 si cas manuels restants ou erreur.
 */
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import { createScriptPrismaClient } from "./helpers/prisma-client";

// Réplique de getUploadsDirectory() (core/uploads/runtime.ts, module "server-only").
function resolveUploadsDirectory(): string {
  return path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "public/uploads");
}

// Réplique de buildPublicUrl() (scripts/import-woocommerce/media/media-storage.ts).
function buildPublicUrl(storageKey: string): string {
  const uploadsPrefix = (process.env.UPLOADS_DIR ?? "public/uploads")
    .replace(/^public\//, "")
    .replaceAll("\\", "/");
  return `/${uploadsPrefix}/${storageKey}`;
}

function normalizeStorageKey(storageKey: string): string {
  return storageKey.replaceAll("\\", "/").replace(/^\/+/, "");
}

async function scanUploadsFiles(uploadsRoot: string): Promise<string[]> {
  const collected: string[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(absolutePath);
      } else if (entry.isFile()) {
        collected.push(path.relative(uploadsRoot, absolutePath).split(path.sep).join("/"));
      }
    }
  }

  await walk(uploadsRoot);
  return collected.sort();
}

const USAGE_COUNT_SELECT = {
  references: true,
  socialPublicationAssets: true,
  categoriesAsPrimaryImage: true,
  categoriesAsCoverImage: true,
  productsAsPrimaryImage: true,
  productVariantsAsPrimaryImage: true,
  pagesAsPrimaryImage: true,
  pagesAsCoverImage: true,
  pageSectionsAsPrimaryImage: true,
  pageSectionsAsCoverImage: true,
  pageBlocksAsPrimaryImage: true,
  pageBlocksAsSecondaryImage: true,
  blogCategoriesAsPrimaryImage: true,
  blogCategoriesAsCoverImage: true,
  blogPostsAsPrimaryImage: true,
  blogPostsAsCoverImage: true,
  homepageSectionsAsPrimaryImage: true,
  homepageSectionsAsSecondaryImage: true,
  seoOpenGraphFor: true,
  seoTwitterFor: true,
  publicEventsAsPrimaryImage: true,
  publicEventsAsCoverImage: true,
  bundlesAsPrimaryImage: true,
} as const;

type UsageCounts = Record<keyof typeof USAGE_COUNT_SELECT, number>;

function totalUsage(counts: UsageCounts): number {
  return Object.values(counts).reduce((sum, value) => sum + value, 0);
}

function usedRelations(counts: UsageCounts): string {
  return (
    Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([key, value]) => `${key}=${value}`)
      .join(", ") || "(aucune)"
  );
}

type Plan = {
  repairStorageKey: Array<{ id: string; from: string; to: string; matchedBy: string }>;
  archive: Array<{ id: string; storageKey: string }>;
  manual: Array<{ id: string; storageKey: string; usage: string; reason: string }>;
};

async function main(): Promise<number> {
  const apply = process.argv.includes("--apply");
  const prisma = createScriptPrismaClient();

  try {
    const uploadsRoot = resolveUploadsDirectory();
    console.info(`Mode         : ${apply ? "APPLY (mutations DB ciblées)" : "DRY-RUN (aucun changement)"}`);
    console.info(`UPLOADS_DIR  : ${uploadsRoot}`);

    const files = await scanUploadsFiles(uploadsRoot);
    const fileSet = new Set(files);

    const assets = await prisma.mediaAsset.findMany({
      where: { archivedAt: null, status: { not: "ARCHIVED" } },
      select: {
        id: true,
        storeId: true,
        storageKey: true,
        publicUrl: true,
        status: true,
        mimeType: true,
        sizeBytes: true,
        checksumSha256: true,
        _count: { select: USAGE_COUNT_SELECT },
      },
      orderBy: { storageKey: "asc" },
    });

    const allKeys = new Set(assets.map((asset) => normalizeStorageKey(asset.storageKey)));
    const missing = assets.filter((asset) => !fileSet.has(normalizeStorageKey(asset.storageKey)));
    const orphanFiles = files.filter((file) => !allKeys.has(file));

    console.info(`Assets actifs : ${assets.length} — dont fichier manquant : ${missing.length}`);
    console.info(`Fichiers sans asset (candidats équivalents) : ${orphanFiles.length}`);

    if (missing.length === 0) {
      console.info("\nRien à réparer (exit 0).");
      return 0;
    }

    // Checksums des fichiers orphelins, calculés une seule fois si nécessaire.
    let orphanChecksums: Map<string, string> | null = null;
    async function getOrphanChecksums(): Promise<Map<string, string>> {
      if (orphanChecksums === null) {
        orphanChecksums = new Map();
        for (const file of orphanFiles) {
          const content = await readFile(path.join(uploadsRoot, file));
          orphanChecksums.set(file, createHash("sha256").update(content).digest("hex"));
        }
      }
      return orphanChecksums;
    }

    const plan: Plan = { repairStorageKey: [], archive: [], manual: [] };

    for (const asset of missing) {
      const usage = totalUsage(asset._count);

      // 1) Chercher un équivalent : checksum d'abord, sinon nom de fichier exact.
      let candidates: string[] = [];
      let matchedBy = "";
      if (asset.checksumSha256 != null) {
        const checksums = await getOrphanChecksums();
        candidates = orphanFiles.filter((file) => checksums.get(file) === asset.checksumSha256);
        matchedBy = "checksum sha256";
      }
      if (candidates.length === 0) {
        const baseName = path.posix.basename(normalizeStorageKey(asset.storageKey));
        candidates = orphanFiles.filter((file) => path.posix.basename(file) === baseName);
        matchedBy = "nom de fichier";
      }

      const uniqueCandidate = candidates.length === 1 ? candidates[0] : undefined;
      if (uniqueCandidate !== undefined && !allKeys.has(uniqueCandidate)) {
        plan.repairStorageKey.push({
          id: asset.id,
          from: asset.storageKey,
          to: uniqueCandidate,
          matchedBy,
        });
        continue;
      }

      if (candidates.length > 1) {
        plan.manual.push({
          id: asset.id,
          storageKey: asset.storageKey,
          usage: usedRelations(asset._count),
          reason: `équivalents ambigus (${candidates.length} candidats par ${matchedBy})`,
        });
        continue;
      }

      // 2) Aucun équivalent : archiver si non référencé, sinon action manuelle.
      if (usage === 0) {
        plan.archive.push({ id: asset.id, storageKey: asset.storageKey });
      } else {
        plan.manual.push({
          id: asset.id,
          storageKey: asset.storageKey,
          usage: usedRelations(asset._count),
          reason: "référencé, aucun fichier équivalent trouvé",
        });
      }
    }

    console.info(`\n=== Corrections storageKey (${plan.repairStorageKey.length}) ===`);
    for (const item of plan.repairStorageKey) {
      console.info(`  - ${item.id}\n      ${item.from}\n    → ${item.to} (match : ${item.matchedBy})`);
    }

    console.info(`\n=== Archivages (assets non référencés, ${plan.archive.length}) ===`);
    for (const item of plan.archive) {
      console.info(`  - ${item.id} | ${item.storageKey}`);
    }

    console.info(`\n=== Action manuelle requise (${plan.manual.length}) — AUCUNE mutation ===`);
    for (const item of plan.manual) {
      console.info(`  - ${item.id} | ${item.storageKey}\n      cause : ${item.reason}\n      usages : ${item.usage}`);
    }

    if (apply) {
      for (const item of plan.repairStorageKey) {
        const current = await prisma.mediaAsset.findUnique({
          where: { id: item.id },
          select: { storageKey: true, publicUrl: true },
        });
        if (current === null || current.storageKey !== item.from) {
          console.warn(`  ! ${item.id} a changé depuis l'analyse — ignoré.`);
          continue;
        }
        await prisma.mediaAsset.update({
          where: { id: item.id },
          data: {
            storageKey: item.to,
            ...(current.publicUrl !== null && { publicUrl: buildPublicUrl(item.to) }),
          },
        });
        console.info(`  ✔ storageKey corrigé : ${item.id}`);
      }

      for (const item of plan.archive) {
        await prisma.mediaAsset.update({
          where: { id: item.id },
          data: { status: "ARCHIVED", archivedAt: new Date() },
        });
        console.info(`  ✔ archivé : ${item.id}`);
      }
    } else if (plan.repairStorageKey.length > 0 || plan.archive.length > 0) {
      console.info("\nDry-run : relancer avec --apply pour appliquer les actions ci-dessus.");
    }

    const hasManual = plan.manual.length > 0;
    console.info(
      hasManual
        ? `\nRésultat : ${plan.manual.length} cas nécessitent une action manuelle (exit 1).`
        : "\nRésultat : aucun cas manuel restant (exit 0)."
    );
    return hasManual ? 1 : 0;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error("Erreur pendant la réparation :", error);
    process.exitCode = 1;
  });
