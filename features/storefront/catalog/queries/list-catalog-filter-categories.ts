import { db } from "@/core/db";
import type { CatalogCategoryFilterItem } from "@/features/storefront/catalog/types";

export async function listCatalogFilterCategories(): Promise<CatalogCategoryFilterItem[]> {
  const categories = await db.category.findMany({
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      slug: true,
      name: true,
    },
  });

  return categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
  }));
}
