/**
 * Archivage ciblé — références CATEGORY fantômes des assets catégories Woo + assets orphelins.
 * Usage :
 *   pnpm tsx scripts/archive-obsolete-woocommerce-category-media.ts            (dry-run)
 *   pnpm tsx scripts/archive-obsolete-woocommerce-category-media.ts --apply
 *
 * Cible STRICTE :
 * - MediaAsset actifs dont storageKey commence par `imports/woocommerce/categories/` ;
 * - fichier physique manquant sous UPLOADS_DIR ;
 * - uniquement des références CATEGORY pointant des catégories ARCHIVED ou absentes.
 *
 * Garde-fous :
 * - référence vers catégorie ACTIVE / DRAFT / INACTIVE → BLOQUÉ, aucune mutation ;
 * - référence active non-CATEGORY → BLOQUÉ ;
 * - usage FK direct actif (primaryImage/coverImage/…) → asset non archivé ;
 * - aucune suppression DB, aucune suppression de fichier, catégories jamais modifiées ;
 * - idempotent : refs déjà archivées et assets déjà archivés sont ignorés.
 *
 * Exit : 0 si aucun blocage ; 1 si blocages (rapport manuel) ou erreur.
 */
import { access } from "node:fs/promises";
import path from "node:path";

import { createScriptPrismaClient } from "./helpers/prisma-client";

const WOO_CATEGORY_KEY_PREFIX = "imports/woocommerce/categories/";

// Réplique de getUploadsDirectory() (core/uploads/runtime.ts, module "server-only").
function resolveUploadsDirectory(): string {
  return path.resolve(process.cwd(), process.env.UPLOADS_DIR ?? "public/uploads");
}

async function fileExists(uploadsRoot: string, storageKey: string): Promise<boolean> {
  try {
    await access(path.join(uploadsRoot, storageKey));
    return true;
  } catch {
    return false;
  }
}

// Relations d'usage direct (FK) hors MediaReference — un compte > 0 empêche l'archivage.
const DIRECT_FK_COUNT_SELECT = {
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

async function main(): Promise<number> {
  const apply = process.argv.includes("--apply");
  const prisma = createScriptPrismaClient();
  let blockedCount = 0;
  let refsToArchive = 0;
  let assetsToArchive = 0;

  try {
    const uploadsRoot = resolveUploadsDirectory();
    console.info(`Mode        : ${apply ? "APPLY" : "DRY-RUN (aucun changement)"}`);
    console.info(`UPLOADS_DIR : ${uploadsRoot}`);

    const assets = await prisma.mediaAsset.findMany({
      where: {
        archivedAt: null,
        status: { not: "ARCHIVED" },
        storageKey: { startsWith: WOO_CATEGORY_KEY_PREFIX },
      },
      select: {
        id: true,
        storageKey: true,
        references: {
          select: {
            id: true,
            subjectType: true,
            subjectId: true,
            role: true,
            isActive: true,
            archivedAt: true,
          },
        },
        _count: { select: DIRECT_FK_COUNT_SELECT },
      },
      orderBy: { storageKey: "asc" },
    });

    console.info(`Assets actifs ciblés (préfixe Woo catégories) : ${assets.length}`);

    for (const asset of assets) {
      console.info(`\n${asset.id} | ${asset.storageKey}`);

      if (await fileExists(uploadsRoot, asset.storageKey)) {
        console.info("  → fichier présent sur disque : hors périmètre, ignoré.");
        continue;
      }

      const activeRefs = asset.references.filter(
        (ref) => ref.isActive && ref.archivedAt === null
      );
      const obsoleteRefs: typeof activeRefs = [];
      let blocked = false;

      for (const ref of activeRefs) {
        if (ref.subjectType !== "CATEGORY") {
          console.warn(
            `  BLOQUÉ : référence active non-CATEGORY (${ref.id} : ${ref.subjectType}/${ref.subjectId}).`
          );
          blocked = true;
          continue;
        }

        const category = await prisma.category.findUnique({
          where: { id: ref.subjectId },
          select: { id: true, name: true, slug: true, status: true },
        });

        if (category === null) {
          console.info(
            `  ref ${ref.id} (role=${ref.role}) → catégorie ABSENTE (${ref.subjectId}) : obsolète.`
          );
          obsoleteRefs.push(ref);
        } else if (category.status === "ARCHIVED") {
          console.info(
            `  ref ${ref.id} (role=${ref.role}) → catégorie ARCHIVED ${category.slug} (${category.name}) : obsolète.`
          );
          obsoleteRefs.push(ref);
        } else {
          console.warn(
            `  BLOQUÉ : référence vers catégorie ${category.status} ${category.slug} (${category.id}) — action manuelle.`
          );
          blocked = true;
        }
      }

      const directFkUsage = Object.entries(asset._count)
        .filter(([, count]) => count > 0)
        .map(([relation, count]) => `${relation}=${count}`);

      if (blocked) {
        blockedCount += 1;
        console.warn("  → asset BLOQUÉ : aucune mutation pour cet asset.");
        continue;
      }

      refsToArchive += obsoleteRefs.length;
      const remainingActiveRefs = activeRefs.length - obsoleteRefs.length;
      const canArchiveAsset = remainingActiveRefs === 0 && directFkUsage.length === 0;

      if (directFkUsage.length > 0) {
        console.warn(
          `  FK directes actives : ${directFkUsage.join(", ")} → asset NON archivé (refs nettoyées seulement).`
        );
      }

      console.info(
        `  Action prévue : archiver ${obsoleteRefs.length} référence(s)${canArchiveAsset ? " puis archiver l'asset" : ""}.`
      );
      if (canArchiveAsset) assetsToArchive += 1;

      if (apply) {
        if (obsoleteRefs.length > 0) {
          await prisma.mediaReference.updateMany({
            where: { id: { in: obsoleteRefs.map((ref) => ref.id) } },
            data: { isActive: false, archivedAt: new Date() },
          });
          console.info(`  ✔ ${obsoleteRefs.length} référence(s) archivée(s).`);
        }

        if (canArchiveAsset) {
          // Recontrôle avant archivage : plus aucune référence active.
          const stillActive = await prisma.mediaReference.count({
            where: { assetId: asset.id, isActive: true, archivedAt: null },
          });
          if (stillActive === 0) {
            await prisma.mediaAsset.update({
              where: { id: asset.id },
              data: { status: "ARCHIVED", archivedAt: new Date() },
            });
            console.info("  ✔ asset archivé.");
          } else {
            console.warn(`  ! ${stillActive} référence(s) encore active(s) — asset non archivé.`);
          }
        }
      }
    }

    console.info(
      `\nSynthèse : ${refsToArchive} référence(s) obsolète(s), ${assetsToArchive} asset(s) archivable(s), ${blockedCount} bloqué(s).`
    );
    if (!apply && (refsToArchive > 0 || assetsToArchive > 0)) {
      console.info("Dry-run : relancer avec --apply pour appliquer ce plan.");
    }

    console.info(
      blockedCount > 0
        ? `\nRésultat : ${blockedCount} asset(s) bloqué(s) — action manuelle requise (exit 1).`
        : "\nRésultat : aucun blocage (exit 0)."
    );
    return blockedCount > 0 ? 1 : 0;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error("Erreur pendant l'archivage :", error);
    process.exitCode = 1;
  });
