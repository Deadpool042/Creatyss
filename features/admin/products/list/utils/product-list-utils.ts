import type { Prisma } from "@/prisma-generated/client";
import type { ProductFilterCategoryOption } from "@/features/admin/products/list/types/product-table.types";

// ── buildAdminProductsCategoryFilter ────────────────────────────────────────

type BuildAdminProductsCategoryFilterInput = {
  category: string;
};

export function buildAdminProductsCategoryFilter(
  input: BuildAdminProductsCategoryFilterInput
): Prisma.ProductWhereInput["productCategories"] | undefined {
  const normalizedCategory = input.category.trim();

  if (normalizedCategory.length === 0 || normalizedCategory === "all") {
    return undefined;
  }

  return {
    some: {
      OR: [
        {
          category: {
            id: normalizedCategory,
          },
        },
        {
          category: {
            slug: normalizedCategory,
          },
        },
        {
          category: {
            parent: {
              id: normalizedCategory,
            },
          },
        },
        {
          category: {
            parent: {
              slug: normalizedCategory,
            },
          },
        },
      ],
    },
  };
}

// ── buildAdminProductsCategorySelectOptions ──────────────────────────────────

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

// ── parsePriceValue / stripHtml ──────────────────────────────────────────────

export function parsePriceValue(priceValue?: number): number {
  return typeof priceValue === "number" ? priceValue : Number.POSITIVE_INFINITY;
}

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
