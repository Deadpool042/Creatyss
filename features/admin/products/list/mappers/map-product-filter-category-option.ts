import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types";

type ProductFilterCategorySource = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  parent: {
    name: string;
  } | null;
};

export function mapProductFilterCategoryOption(
  category: ProductFilterCategorySource
): ProductFilterCategoryOption {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    parentId: category.parentId,
    parentName: category.parent?.name ?? null,
  };
}
