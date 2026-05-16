import type { BoutiqueCategoryItem } from "@/features/storefront/catalog/boutique-page/types";

export type CategoryGroup = {
  parent: BoutiqueCategoryItem;
  children: BoutiqueCategoryItem[];
};

export function buildCategoryGroups(categories: BoutiqueCategoryItem[]): CategoryGroup[] {
  const roots = categories.filter((c) => c.parentId === null);
  return roots.map((parent) => ({
    parent,
    children: categories.filter((c) => c.parentId === parent.id),
  }));
}
