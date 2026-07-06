import "server-only";

import { db } from "@/core/db";

export type CategoriesGovernanceData = Readonly<{
  totalCategories: number;
  activeCategories: number;
  productsWithoutCategory: number;
}>;

export async function getCategoriesGovernanceData(): Promise<CategoriesGovernanceData | null> {
  try {
    const [totalCategories, activeCategories, productsWithoutCategory] =
      await Promise.all([
        db.category.count(),
        db.category.count({ where: { status: "ACTIVE" } }),
        db.product.count({
          where: { productCategories: { none: {} } },
        }),
      ]);

    return {
      totalCategories,
      activeCategories,
      productsWithoutCategory,
    };
  } catch {
    return null;
  }
}
