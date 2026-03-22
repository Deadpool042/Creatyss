export type PageStatus = "draft" | "published" | "archived";

export type PageType = "homepage" | "standard" | "legal" | "landing";

export type PublishedPageSummary = {
  id: string;
  slug: string;
  title: string;
  pageType: PageType;
  summary: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
};

export type PageDetail = {
  id: string;
  slug: string;
  title: string;
  pageType: PageType;
  summary: string | null;
  contentJson: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  isIndexed: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
};
