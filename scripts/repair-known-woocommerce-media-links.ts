/**
 * Relink manuel — assets Woo manquants connus (catégories + produit cabas mandarin).
 * Usage :
 *   pnpm tsx scripts/repair-known-woocommerce-media-links.ts            (dry-run)
 *   pnpm tsx scripts/repair-known-woocommerce-media-links.ts --apply
 *
 * Périmètre :
 * - catégories : mapping explicite slug → fichier seed existant ; correction de
 *   MediaAsset.storageKey (+ publicUrl si stocké) des assets liés dont le fichier manque ;
 * - produit `sac-a-main-cabas-mandarin` : AUDIT/RAPPORT uniquement, aucune mutation
 *   (aucun équivalent fiable sur disque — vérifié) ;
 * - aucune suppression physique, aucun archivage, aucune création de MediaAsset ;
 * - id, références, alt, caption inchangés ;
 * - idempotent : un asset déjà conforme est ignoré au re-run.
 *
 * Exit code : 0 si toutes les corrections catégories sont faites/conformes ;
 * 1 si un blocage catégorie est détecté ou si le produit nécessite une action manuelle.
 */
import { access } from "node:fs/promises";
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

async function fileExists(uploadsRoot: string, storageKey: string): Promise<boolean> {
  try {
    await access(path.join(uploadsRoot, storageKey));
    return true;
  } catch {
    return false;
  }
}

/**
 * Mapping validé manuellement (audit Media V1) :
 * les images catégories importées de WooCommerce ont disparu du disque,
 * remplacées par les fichiers seed ci-dessous, tous vérifiés présents.
 */
const CATEGORY_STORAGE_KEY_FIXES: ReadonlyArray<{
  categorySlug: string;
  targetStorageKey: string;
}> = [
  { categorySlug: "cabas", targetStorageKey: "category-cabas.webp" },
  { categorySlug: "les-sacs-a-bandouliere", targetStorageKey: "categories/cat-bandouiliere.webp" },
  { categorySlug: "mini-sacs", targetStorageKey: "categories/cat-mini-sac.webp" },
  { categorySlug: "pochettes", targetStorageKey: "categories/cat-pochette.webp" },
  { categorySlug: "sacs-a-dos", targetStorageKey: "categories/cat-sac-a-dos.webp" },
  { categorySlug: "sacs-creatyss", targetStorageKey: "categories/cat-sac-a-main.webp" },
];

const MANDARIN_PRODUCT_SLUG = "sac-a-main-cabas-mandarin";

type AssetLite = {
  id: string;
  storeId: string | null;
  storageKey: string;
  publicUrl: string | null;
  status: string;
  archivedAt: Date | null;
};

async function main(): Promise<number> {
  const apply = process.argv.includes("--apply");
  const prisma = createScriptPrismaClient();
  let blocked = 0;
  let manual = 0;

  try {
    const uploadsRoot = resolveUploadsDirectory();
    console.info(`Mode        : ${apply ? "APPLY" : "DRY-RUN (aucun changement)"}`);
    console.info(`UPLOADS_DIR : ${uploadsRoot}`);

    // ── Étape catégories ─────────────────────────────────────────────
    console.info("\n=== Catégories ===");

    for (const fix of CATEGORY_STORAGE_KEY_FIXES) {
      const label = `[${fix.categorySlug}]`;

      if (!(await fileExists(uploadsRoot, fix.targetStorageKey))) {
        console.warn(`${label} BLOQUÉ : fichier cible absent (${fix.targetStorageKey}).`);
        blocked += 1;
        continue;
      }

      const category = await prisma.category.findFirst({
        where: { slug: fix.categorySlug },
        select: {
          id: true,
          storeId: true,
          name: true,
          primaryImage: {
            select: { id: true, storeId: true, storageKey: true, publicUrl: true, status: true, archivedAt: true },
          },
          coverImage: {
            select: { id: true, storeId: true, storageKey: true, publicUrl: true, status: true, archivedAt: true },
          },
        },
      });

      if (category === null) {
        console.warn(`${label} BLOQUÉ : catégorie introuvable en base.`);
        blocked += 1;
        continue;
      }

      // Assets liés à la catégorie : FK directes + MediaReference CATEGORY.
      const referencedAssets = await prisma.mediaReference.findMany({
        where: { subjectType: "CATEGORY", subjectId: category.id, archivedAt: null },
        select: {
          asset: {
            select: { id: true, storeId: true, storageKey: true, publicUrl: true, status: true, archivedAt: true },
          },
        },
      });

      const linkedAssets = new Map<string, AssetLite>();
      for (const asset of [category.primaryImage, category.coverImage, ...referencedAssets.map((r) => r.asset)]) {
        if (asset !== null) linkedAssets.set(asset.id, asset);
      }

      const candidates = [...linkedAssets.values()].filter(
        (asset) =>
          asset.archivedAt === null &&
          asset.status !== "ARCHIVED" &&
          !(asset.storageKey === fix.targetStorageKey)
      );

      const missingCandidates: AssetLite[] = [];
      for (const asset of candidates) {
        if (!(await fileExists(uploadsRoot, asset.storageKey))) {
          missingCandidates.push(asset);
        }
      }

      if (missingCandidates.length === 0) {
        console.info(`${label} OK : aucun asset actif manquant (déjà conforme ou rien à faire).`);
        continue;
      }

      if (missingCandidates.length > 1) {
        console.warn(
          `${label} BLOQUÉ : ${missingCandidates.length} assets manquants liés — mapping ambigu, action manuelle.`
        );
        for (const asset of missingCandidates) {
          console.warn(`    - ${asset.id} | ${asset.storageKey}`);
        }
        blocked += 1;
        continue;
      }

      const asset = missingCandidates[0];
      if (asset === undefined) continue;

      const conflict = await prisma.mediaAsset.findFirst({
        where: { storeId: asset.storeId, storageKey: fix.targetStorageKey, id: { not: asset.id } },
        select: { id: true },
      });

      if (conflict !== null) {
        console.warn(
          `${label} BLOQUÉ : storageKey cible déjà utilisé par ${conflict.id} (même store) — action manuelle.`
        );
        blocked += 1;
        continue;
      }

      console.info(
        `${label} ${category.name} — asset ${asset.id}\n    ${asset.storageKey}\n  → ${fix.targetStorageKey}`
      );

      if (apply) {
        await prisma.mediaAsset.update({
          where: { id: asset.id },
          data: {
            storageKey: fix.targetStorageKey,
            ...(asset.publicUrl !== null && { publicUrl: buildPublicUrl(fix.targetStorageKey) }),
          },
        });
        console.info(`${label} ✔ appliqué.`);
      }
    }

    // ── Étape produit mandarin : audit/rapport uniquement ───────────
    console.info(`\n=== Produit ${MANDARIN_PRODUCT_SLUG} (audit, aucune mutation) ===`);

    const product = await prisma.product.findFirst({
      where: { slug: MANDARIN_PRODUCT_SLUG },
      select: {
        id: true,
        name: true,
        status: true,
        primaryImage: { select: { id: true, storageKey: true } },
        variants: { select: { id: true, primaryImage: { select: { id: true, storageKey: true } } } },
      },
    });

    if (product === null) {
      console.info("Produit introuvable en base — les assets manquants sont peut-être orphelins de produit.");
    } else {
      console.info(`Produit : ${product.id} | ${product.name} | statut ${product.status}`);

      const productRefs = await prisma.mediaReference.findMany({
        where: {
          OR: [
            { subjectType: "PRODUCT", subjectId: product.id },
            { subjectType: "PRODUCT_VARIANT", subjectId: { in: product.variants.map((v) => v.id) } },
          ],
        },
        select: {
          role: true,
          isPrimary: true,
          subjectType: true,
          asset: { select: { id: true, storageKey: true, status: true, archivedAt: true } },
        },
        orderBy: { sortOrder: "asc" },
      });

      const assetsSeen = new Map<string, { storageKey: string; present: boolean; detail: string }>();
      for (const ref of productRefs) {
        const present = await fileExists(uploadsRoot, ref.asset.storageKey);
        assetsSeen.set(ref.asset.id, {
          storageKey: ref.asset.storageKey,
          present,
          detail: `${ref.subjectType}/${ref.role}${ref.isPrimary ? " (primary)" : ""} | ${ref.asset.status}`,
        });
      }
      if (product.primaryImage !== null && !assetsSeen.has(product.primaryImage.id)) {
        assetsSeen.set(product.primaryImage.id, {
          storageKey: product.primaryImage.storageKey,
          present: await fileExists(uploadsRoot, product.primaryImage.storageKey),
          detail: "Product.primaryImageId",
        });
      }

      const missing = [...assetsSeen.entries()].filter(([, info]) => !info.present);
      const present = [...assetsSeen.entries()].filter(([, info]) => info.present);

      console.info(`Assets liés : ${assetsSeen.size} — présents : ${present.length}, manquants : ${missing.length}`);
      for (const [id, info] of missing) {
        console.info(`  MANQUANT : ${id} | ${info.storageKey} | ${info.detail}`);
      }

      const hasValidPrimary =
        product.primaryImage !== null &&
        (await fileExists(uploadsRoot, product.primaryImage.storageKey));
      console.info(`Image primaire valide sur disque : ${hasValidPrimary ? "oui" : "NON"}`);

      if (missing.length > 0) {
        manual += missing.length;
        console.info(
          "→ Aucun équivalent fiable sur disque (aucun dossier produit mandarin/cabas)." +
            "\n→ Action manuelle requise : ré-uploader les images du produit ou ré-importer ce produit depuis Woo."
        );
      } else {
        console.info("→ Rien à signaler pour ce produit.");
      }
    }

    if (!apply && blocked === 0) {
      console.info("\nDry-run : relancer avec --apply pour appliquer les corrections catégories.");
    }

    const exitCode = blocked > 0 || manual > 0 ? 1 : 0;
    console.info(
      exitCode === 0
        ? "\nRésultat : aucune action manuelle restante (exit 0)."
        : `\nRésultat : ${blocked} blocage(s) catégorie, ${manual} asset(s) produit en action manuelle (exit 1).`
    );
    return exitCode;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error("Erreur pendant le relink :", error);
    process.exitCode = 1;
  });
