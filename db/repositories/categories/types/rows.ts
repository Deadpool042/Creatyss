import type { Prisma } from "@prisma/client";

const categorySeoSelect = {
  metaTitle: true,
  metaDescription: true,
  canonicalUrl: true,
  indexingState: true,
} as const satisfies Prisma.SeoMetadataSelect;

const nestedCategoryChildSelect = {
  id: true,
  storeId: true,
  parentId: true,
  slug: true,
  name: true,
  description: true,
  status: true,
  sortOrder: true,
  isFeatured: true,
} as const satisfies Prisma.CategorySelect;

export const categorySummarySelect = {
  id: true,
  storeId: true,
  parentId: true,
  slug: true,
  name: true,
  description: true,
  status: true,
  sortOrder: true,
  isFeatured: true,
  createdAt: true,
  updatedAt: true,
  seo: {
    select: categorySeoSelect,
  },
} as const satisfies Prisma.CategorySelect;

export const categoryDetailSelect = {
  ...categorySummarySelect,
  parent: {
    select: {
      id: true,
      slug: true,
      name: true,
    },
  },
  children: {
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: nestedCategoryChildSelect,
  },
} as const satisfies Prisma.CategorySelect;

export type CategorySummaryRow = Prisma.CategoryGetPayload<{
  select: typeof categorySummarySelect;
}>;

export type CategoryDetailRow = Prisma.CategoryGetPayload<{
  select: typeof categoryDetailSelect;
}>;

export type NestedCategoryChildRow = Prisma.CategoryGetPayload<{
  select: typeof nestedCategoryChildSelect;
}>;
