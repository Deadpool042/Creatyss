export type PageStatus = "draft" | "active" | "archived";

export type PageSectionKind =
  | "hero"
  | "rich_text"
  | "image"
  | "image_text"
  | "featured_products"
  | "featured_categories"
  | "featured_posts"
  | "editorial"
  | "custom";

export type PageSeoIndexingState = "index" | "noindex";

export type PageSeoSnapshot = {
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  indexingState: PageSeoIndexingState;
};

export type PageSection = {
  id: string;
  kind: PageSectionKind;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  imageAssetId: string | null;
  sortOrder: number;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PageSummary = {
  id: string;
  storeId: string;
  slug: string;
  title: string;
  description: string | null;
  status: PageStatus;
  isHomepage: boolean;
  seo: PageSeoSnapshot | null;
  createdAt: Date;
  updatedAt: Date;
};

export type PageDetail = PageSummary & {
  sections: PageSection[];
};

export class PageRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PageRepositoryError";
    this.code = code;
  }
}
