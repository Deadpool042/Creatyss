import type { Prisma } from "@/prisma-generated/client";

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
