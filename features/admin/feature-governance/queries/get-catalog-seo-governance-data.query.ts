import "server-only";

import { db } from "@/core/db";

export type CatalogSeoGovernanceData = Readonly<{
  totalMeta: number;
  publishedMeta: number;
  withoutSeo: number;
}>;

export async function getCatalogSeoGovernanceData(): Promise<CatalogSeoGovernanceData | null> {
  try {
    const [totalMeta, publishedMeta, totalProducts] = await Promise.all([
      db.seoMetadata.count({
        where: { subjectType: "PRODUCT" },
      }),
      db.seoMetadata.count({
        where: {
          subjectType: "PRODUCT",
          status: "ACTIVE",
        },
      }),
      db.product.count(),
    ]);

    return {
      totalMeta,
      publishedMeta,
      withoutSeo: Math.max(0, totalProducts - totalMeta),
    };
  } catch {
    return null;
  }
}
