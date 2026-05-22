import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types/product-table.types";

type BuildAdminProductsCategorySelectOptionsInput = {
  categories: ProductFilterCategoryOption[];
  selectedParentCategoryId: string;
};

type BuildAdminProductsCategorySelectOptionsResult = {
  parentCategories: ProductFilterCategoryOption[];
  childCategories: ProductFilterCategoryOption[];
};

function sortCategories(
  left: ProductFilterCategoryOption,
  right: ProductFilterCategoryOption
): number {
  return left.name.localeCompare(right.name, "fr");
}

export function buildAdminProductsCategorySelectOptions({
  categories,
  selectedParentCategoryId,
}: BuildAdminProductsCategorySelectOptionsInput): BuildAdminProductsCategorySelectOptionsResult {
  const parentCategories = categories
    .filter((category) => category.parentId === null)
    .sort(sortCategories);

  if (!selectedParentCategoryId || selectedParentCategoryId === "all") {
    return {
      parentCategories,
      childCategories: [],
    };
  }

  return {
    parentCategories,
    childCategories: categories
      .filter((category) => category.parentId === selectedParentCategoryId)
      .sort(sortCategories),
  };
}
