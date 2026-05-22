import type { BoutiqueCategoryItem } from "@/features/storefront/catalog/boutique-page/types";

export type CategoryGroup = {
  parent: BoutiqueCategoryItem;
  children: BoutiqueCategoryItem[];
};

export function buildCategoryGroups(categories: BoutiqueCategoryItem[]): CategoryGroup[] {
  const categoryIds = new Set(categories.map((category) => category.id));
  const roots = categories.filter(
    (category) => category.parentId === null || !categoryIds.has(category.parentId)
  );

  // Si la hiérarchie est partiellement orpheline en DB, on garde un rendu utilisable.
  const safeRoots = roots.length > 0 ? roots : categories;

  return safeRoots.map((parent) => ({
    parent,
    children: categories.filter((c) => c.parentId === parent.id),
  }));
}
