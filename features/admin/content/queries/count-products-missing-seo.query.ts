import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type ProductsSeoCoverage = {
  total: number;
  totalSeoMissing: number;
};

/**
 * Compte les produits actifs sans titre SEO personnalisé (SeoMetadata PRODUCT
 * active avec metaTitle renseigné). Remplace l'estimation mockée de
 * content/seo (écart consigné dans docs/roadmap/doctrine-domaines-admin).
 */
export async function countProductsMissingSeo(): Promise<ProductsSeoCoverage> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) return { total: 0, totalSeoMissing: 0 };

  const activeProducts = await db.product.findMany({
    where: { storeId, status: "ACTIVE" },
    select: { id: true },
  });

  if (activeProducts.length === 0) return { total: 0, totalSeoMissing: 0 };

  const coveredCount = await db.seoMetadata.count({
    where: {
      storeId,
      subjectType: "PRODUCT",
      status: "ACTIVE",
      metaTitle: { not: null },
      subjectId: { in: activeProducts.map((product) => product.id) },
    },
  });

  return {
    total: activeProducts.length,
    totalSeoMissing: Math.max(0, activeProducts.length - coveredCount),
  };
}
