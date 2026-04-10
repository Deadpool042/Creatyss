import type { PageStatus } from "./page-status";

export type PageInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: PageStatus;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
};
