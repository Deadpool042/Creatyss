import "server-only";

import { db } from "@/core/db";

export type RelatedProductsGovernanceData = Readonly<{
  totalLinks: number;
  productsWithLinks: number;
}>;

export async function getRelatedProductsGovernanceData(): Promise<RelatedProductsGovernanceData | null> {
  try {
    const [totalLinks, productsWithLinks] = await Promise.all([
      db.relatedProduct.count(),
      db.product.count({
        where: { relatedFrom: { some: {} } },
      }),
    ]);

    return {
      totalLinks,
      productsWithLinks,
    };
  } catch {
    return null;
  }
}
