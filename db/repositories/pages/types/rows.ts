import type { Prisma } from "@prisma/client";

const pageSeoSelect = {
  metaTitle: true,
  metaDescription: true,
  canonicalUrl: true,
  indexingState: true,
} as const satisfies Prisma.SeoMetadataSelect;

const pageSectionSelect = {
  id: true,
  kind: true,
  title: true,
  subtitle: true,
  content: true,
  imageAssetId: true,
  sortOrder: true,
  isEnabled: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.PageSectionSelect;

export const pageSummarySelect = {
  id: true,
  storeId: true,
  slug: true,
  title: true,
  description: true,
  status: true,
  isHomepage: true,
  createdAt: true,
  updatedAt: true,
  seo: {
    select: pageSeoSelect,
  },
} as const satisfies Prisma.PageSelect;

export const pageDetailSelect = {
  ...pageSummarySelect,
  sections: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: pageSectionSelect,
  },
} as const satisfies Prisma.PageSelect;

export type PageSummaryRow = Prisma.PageGetPayload<{
  select: typeof pageSummarySelect;
}>;

export type PageDetailRow = Prisma.PageGetPayload<{
  select: typeof pageDetailSelect;
}>;

export type PageSectionRow = Prisma.PageSectionGetPayload<{
  select: typeof pageSectionSelect;
}>;
