import type { Prisma } from "@prisma/client";

export const categorySelect = {
  id: true,
  slug: true,
  name: true,
  description: true,
  status: true,
  isFeatured: true,
  displayOrder: true,
  seoTitle: true,
  seoDescription: true,
  representativeMediaId: true,
  representativeMedia: {
    select: {
      storageKey: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

export type CategoryRow = Prisma.CategoryGetPayload<{
  select: typeof categorySelect;
}>;
