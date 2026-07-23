import { db } from "@/core/db";
import { resolveLocalizedCategoryCopy } from "@/features/storefront/catalog/queries/resolve-localized-category-copy";
import type { CatalogCategoryFilterItem } from "@/features/storefront/catalog/types";

export async function listCatalogFilterCategories(): Promise<CatalogCategoryFilterItem[]> {
  const categories = await db.category.findMany({
    where: {
      archivedAt: null,
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      storeId: true,
      parentId: true,
      slug: true,
      name: true,
    },
  });

  const localizedCategories = await resolveLocalizedCategoryCopy(
    categories.map((category) => ({
      ...category,
      shortDescription: null,
      description: null,
    }))
  );

  return localizedCategories.map((category) => ({
    id: category.id,
    parentId: category.parentId,
    slug: category.slug,
    name: category.name,
  }));
}
