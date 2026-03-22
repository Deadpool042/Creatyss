import type { Prisma } from "@prisma/client";

export const pageListSelect = {
  id: true,
  slug: true,
  title: true,
  pageType: true,
  status: true,
  summary: true,
  isIndexed: true,
  publishedAt: true,
  updatedAt: true,
} satisfies Prisma.PageSelect;

export const pageDetailSelect = {
  id: true,
  slug: true,
  title: true,
  pageType: true,
  status: true,
  summary: true,
  contentJson: true,
  seoTitle: true,
  seoDescription: true,
  isIndexed: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PageSelect;

export type PageListRow = Prisma.PageGetPayload<{
  select: typeof pageListSelect;
}>;

export type PageDetailRow = Prisma.PageGetPayload<{
  select: typeof pageDetailSelect;
}>;
