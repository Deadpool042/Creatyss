/**
 * Diagnostic lecture seule — cohérence fichiers UPLOADS_DIR vs MediaAsset en base.
 * Usage : pnpm tsx scripts/diagnose-media.ts
 *
 * Ne supprime, ne déplace et ne modifie rien (ni fichier, ni ligne DB).
 *
 * Exit code :
 * - 0 : aucun problème critique
 * - 1 : assets actifs sans fichier, fichiers sans asset, ou erreur technique
 */
import { readdir } from "node:fs/promises";
import path from "node:path";

import { createScriptPrismaClient } from "./helpers/prisma-client";

const MAX_LINES_PER_CATEGORY = 50;

// Réplique de getUploadsDirectory() (core/uploads/runtime.ts), non importable ici
// car le module est marqué "server-only". Garder les deux logiques alignées.
function resolveUploadsDirectory(): string {
  return path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "public/uploads");
}

function maskedDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL ?? "(absent)";
  return raw.replace(/:\/\/[^@]+@/, "://***@");
}

function toPosixRelativeKey(uploadsRoot: string, absolutePath: string): string {
  return path.relative(uploadsRoot, absolutePath).split(path.sep).join("/");
}

function normalizeStorageKey(storageKey: string): string {
  return storageKey.replaceAll("\\", "/").replace(/^\/+/, "");
}

async function scanUploadsFiles(uploadsRoot: string): Promise<string[]> {
  const collected: string[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      // Ignorer les fichiers techniques cachés (.gitkeep, .DS_Store, …)
      if (entry.name.startsWith(".")) continue;

      const absolutePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await walk(absolutePath);
      } else if (entry.isFile()) {
        collected.push(toPosixRelativeKey(uploadsRoot, absolutePath));
      }
    }
  }

  await walk(uploadsRoot);
  return collected.sort();
}

type MediaAssetRow = {
  id: string;
  storeId: string | null;
  storageKey: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  archivedAt: Date | null;
  sizeBytes: number | null;
  mimeType: string;
  checksumSha256: string | null;
};

function isArchived(asset: MediaAssetRow): boolean {
  return asset.archivedAt !== null || asset.status === "ARCHIVED";
}

function formatAssetLine(asset: MediaAssetRow): string {
  const size = asset.sizeBytes != null ? `${asset.sizeBytes} o` : "taille ?";
  const checksum = asset.checksumSha256 != null ? asset.checksumSha256.slice(0, 12) : "checksum ?";
  return `  - ${asset.id} | ${asset.storageKey} | ${asset.status} | ${asset.mimeType} | ${size} | ${checksum}`;
}

function printCategory<T>(title: string, items: T[], formatLine: (item: T) => string): void {
  console.info(`\n${title} : ${items.length}`);
  for (const item of items.slice(0, MAX_LINES_PER_CATEGORY)) {
    console.info(formatLine(item));
  }
  if (items.length > MAX_LINES_PER_CATEGORY) {
    console.info(`  … ${items.length - MAX_LINES_PER_CATEGORY} ligne(s) supplémentaire(s) non affichée(s)`);
  }
}

async function main(): Promise<number> {
  const prisma = createScriptPrismaClient();

  try {
    const uploadsRoot = resolveUploadsDirectory();

    console.info("Diagnostic médias — lecture seule");
    console.info(`DATABASE_URL : ${maskedDatabaseUrl()}`);
    console.info(`UPLOADS_DIR  : ${uploadsRoot}`);

    let files: string[] = [];
    try {
      files = await scanUploadsFiles(uploadsRoot);
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") {
        console.warn(`Répertoire uploads introuvable : ${uploadsRoot} — scan fichiers vide.`);
      } else {
        throw error;
      }
    }

    const assets: MediaAssetRow[] = await prisma.mediaAsset.findMany({
      select: {
        id: true,
        storeId: true,
        storageKey: true,
        status: true,
        archivedAt: true,
        sizeBytes: true,
        mimeType: true,
        checksumSha256: true,
      },
      orderBy: { storageKey: "asc" },
    });

    const fileSet = new Set(files);
    const assetKeySet = new Set(assets.map((asset) => normalizeStorageKey(asset.storageKey)));

    const activeAssets = assets.filter((asset) => !isArchived(asset));
    const archivedAssets = assets.filter(isArchived);

    const activeWithFile = activeAssets.filter((asset) =>
      fileSet.has(normalizeStorageKey(asset.storageKey))
    );
    const activeMissingFile = activeAssets.filter(
      (asset) => !fileSet.has(normalizeStorageKey(asset.storageKey))
    );
    const archivedWithFile = archivedAssets.filter((asset) =>
      fileSet.has(normalizeStorageKey(asset.storageKey))
    );
    const archivedMissingFile = archivedAssets.filter(
      (asset) => !fileSet.has(normalizeStorageKey(asset.storageKey))
    );
    const filesWithoutAsset = files.filter((file) => !assetKeySet.has(file));

    console.info("\n=== Synthèse ===");
    console.info(`Fichiers présents sous UPLOADS_DIR        : ${files.length}`);
    console.info(`MediaAsset en base                        : ${assets.length}`);
    console.info(`  dont actifs                             : ${activeAssets.length}`);
    console.info(`  dont archivés                           : ${archivedAssets.length}`);
    console.info(`Assets actifs avec fichier présent        : ${activeWithFile.length}`);
    console.info(`Assets actifs avec fichier MANQUANT       : ${activeMissingFile.length}`);
    console.info(`Fichiers sans MediaAsset                  : ${filesWithoutAsset.length}`);
    console.info(`Assets archivés avec fichier présent      : ${archivedWithFile.length}`);
    console.info(`Assets archivés avec fichier manquant     : ${archivedMissingFile.length}`);

    printCategory(
      "=== Assets actifs avec fichier MANQUANT (critique) ===",
      activeMissingFile,
      formatAssetLine
    );
    printCategory(
      "=== Fichiers sans MediaAsset (critique) ===",
      filesWithoutAsset,
      (file) => `  - ${file}`
    );
    printCategory(
      "=== Assets archivés avec fichier présent (informatif) ===",
      archivedWithFile,
      formatAssetLine
    );
    printCategory(
      "=== Assets archivés avec fichier manquant (informatif) ===",
      archivedMissingFile,
      formatAssetLine
    );

    const hasCriticalIssue = activeMissingFile.length > 0 || filesWithoutAsset.length > 0;

    console.info(
      hasCriticalIssue
        ? "\nRésultat : problèmes critiques détectés (exit 1)."
        : "\nRésultat : aucun problème critique (exit 0)."
    );

    return hasCriticalIssue ? 1 : 0;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error("Erreur pendant le diagnostic :", error);
    process.exitCode = 1;
  });
