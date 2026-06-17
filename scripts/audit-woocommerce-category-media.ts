/**
 * Audit lecture seule — 6 MediaAsset catégories Woo manquants.
 * Usage : pnpm tsx scripts/audit-woocommerce-category-media.ts
 *
 * AUCUNE mutation : uniquement des findMany/findFirst.
 * Objectif : expliquer pourquoi ces assets restent actifs/référencés alors que
 * les catégories Woo semblent absentes ou déjà conformes.
 */
import { createScriptPrismaClient } from "./helpers/prisma-client";

const WOO_CATEGORY_KEY_PREFIX = "imports/woocommerce/categories/";

const SEED_STORAGE_KEYS = [
  "category-cabas.webp",
  "categories/cat-bandouiliere.webp",
  "categories/cat-mini-sac.webp",
  "categories/cat-pochette.webp",
  "categories/cat-sac-a-dos.webp",
  "categories/cat-sac-a-main.webp",
] as const;

// Fragments de recherche de catégories proches, par slug Woo.
const SLUG_FRAGMENTS: Record<string, string[]> = {
  cabas: ["cabas"],
  "les-sacs-a-bandouliere": ["bandouliere", "bandoulière"],
  "mini-sacs": ["mini"],
  pochettes: ["pochette"],
  "sacs-a-dos": ["dos"],
  "sacs-creatyss": ["sac", "creatyss"],
};

function wooSlugFromStorageKey(storageKey: string): string {
  return storageKey.replace(WOO_CATEGORY_KEY_PREFIX, "").split("/")[0] ?? "?";
}

async function main(): Promise<number> {
  const prisma = createScriptPrismaClient();

  try {
    // ── 1+2+3 : assets Woo catégories, références, catégories ciblées ──
    const assets = await prisma.mediaAsset.findMany({
      where: { storageKey: { startsWith: WOO_CATEGORY_KEY_PREFIX } },
      select: {
        id: true,
        storeId: true,
        storageKey: true,
        status: true,
        archivedAt: true,
        references: {
          select: {
            id: true,
            subjectType: true,
            subjectId: true,
            role: true,
            sortOrder: true,
            isPrimary: true,
            isActive: true,
            archivedAt: true,
          },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { storageKey: "asc" },
    });

    console.info(`=== Assets Woo catégories (${assets.length}) ===`);

    for (const asset of assets) {
      const wooSlug = wooSlugFromStorageKey(asset.storageKey);
      console.info(
        `\n${asset.id} | ${asset.storageKey}\n  status=${asset.status} archivedAt=${asset.archivedAt?.toISOString() ?? "null"} storeId=${asset.storeId ?? "null"}`
      );

      if (asset.references.length === 0) {
        console.info("  MediaReference : (aucune)");
      }

      for (const ref of asset.references) {
        console.info(
          `  MediaReference ${ref.id} : ${ref.subjectType}/${ref.subjectId} role=${ref.role} sortOrder=${ref.sortOrder} isPrimary=${ref.isPrimary} isActive=${ref.isActive} archivedAt=${ref.archivedAt?.toISOString() ?? "null"}`
        );

        if (ref.subjectType === "CATEGORY") {
          const category = await prisma.category.findUnique({
            where: { id: ref.subjectId },
            select: {
              id: true,
              name: true,
              slug: true,
              status: true,
              archivedAt: true,
              primaryImageId: true,
              coverImageId: true,
            },
          });
          console.info(
            category === null
              ? "    → Category INTROUVABLE (référence orpheline : subjectId sans ligne)"
              : `    → Category ${category.id} | ${category.name} | slug=${category.slug} | status=${category.status} | archivedAt=${category.archivedAt?.toISOString() ?? "null"} | primaryImageId=${category.primaryImageId ?? "null"} | coverImageId=${category.coverImageId ?? "null"}`
          );
        }
      }

      // FK inverses directes éventuelles (catégories pointant cet asset).
      const fkCategories = await prisma.category.findMany({
        where: { OR: [{ primaryImageId: asset.id }, { coverImageId: asset.id }] },
        select: { id: true, name: true, slug: true, status: true },
      });
      for (const cat of fkCategories) {
        console.info(
          `  FK directe : Category ${cat.id} | ${cat.name} | slug=${cat.slug} | status=${cat.status}`
        );
      }

      // ── 4 : catégories proches du slug Woo ──
      const fragments = SLUG_FRAGMENTS[wooSlug] ?? [wooSlug];
      const near = await prisma.category.findMany({
        where: {
          OR: [
            { slug: wooSlug },
            ...fragments.map((fragment) => ({ slug: { contains: fragment } })),
            ...fragments.map((fragment) => ({
              name: { contains: fragment, mode: "insensitive" as const },
            })),
          ],
        },
        select: { id: true, name: true, slug: true, status: true, primaryImageId: true },
      });
      console.info(
        `  Catégories proches (slug Woo "${wooSlug}") : ${
          near.length === 0
            ? "(aucune)"
            : near.map((c) => `${c.slug} [${c.status}] primaryImageId=${c.primaryImageId ?? "null"}`).join(" ; ")
        }`
      );
    }

    // ── 5 : toutes les catégories actuelles ──
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        primaryImageId: true,
        coverImageId: true,
      },
      orderBy: [{ status: "asc" }, { slug: "asc" }],
    });
    console.info(`\n=== Toutes les catégories (${allCategories.length}) ===`);
    for (const cat of allCategories) {
      console.info(
        `  ${cat.id} | ${cat.slug} | ${cat.name} | ${cat.status} | primaryImageId=${cat.primaryImageId ?? "null"} | coverImageId=${cat.coverImageId ?? "null"}`
      );
    }

    // ── 6 : MediaAsset existants pour les fichiers seed ──
    const seedAssets = await prisma.mediaAsset.findMany({
      where: { storageKey: { in: [...SEED_STORAGE_KEYS] } },
      select: { id: true, storageKey: true, status: true, archivedAt: true, storeId: true },
    });
    console.info(`\n=== MediaAsset des fichiers seed (${seedAssets.length}/${SEED_STORAGE_KEYS.length}) ===`);
    const seedKeysFound = new Set(seedAssets.map((a) => a.storageKey));
    for (const asset of seedAssets) {
      console.info(`  ${asset.id} | ${asset.storageKey} | ${asset.status} | archivedAt=${asset.archivedAt?.toISOString() ?? "null"}`);
    }
    for (const key of SEED_STORAGE_KEYS) {
      if (!seedKeysFound.has(key)) {
        console.info(`  (absent en DB) ${key} — fichier sur disque sans MediaAsset`);
      }
    }

    console.info("\nAudit terminé — aucune mutation effectuée (exit 0).");
    return 0;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error("Erreur pendant l'audit :", error);
    process.exitCode = 1;
  });
