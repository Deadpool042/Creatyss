import "server-only";

import { db } from "@/core/db";

export type VariantsGovernanceData = Readonly<{
  totalVariants: number;
  productsWithVariants: number;
  totalProducts: number;
}>;

export async function getVariantsGovernanceData(): Promise<VariantsGovernanceData | null> {
  try {
    const [totalVariants, productsWithVariants, totalProducts] = await Promise.all([
      db.productVariant.count(),
      db.product.count({ where: { variants: { some: {} } } }),
      db.product.count(),
    ]);

    return {
      totalVariants,
      productsWithVariants,
      totalProducts,
    };
  } catch {
    return null;
  }
}
