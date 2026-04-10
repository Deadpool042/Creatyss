import type { PageStatus } from "./page-status";

export type PageId = string;

export type PageSectionId = string;

export type PageBlockId = string;

export type PageSeo = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
};

export type PageListItem = {
  id: PageId;
  title: string;
  slug: string;
  status: PageStatus;
  updatedAt: string;
};

export type PageDetail = {
  id: PageId;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  status: PageStatus;
  seo: PageSeo;
  updatedAt: string;
};
