export type AdminPageStatus = "draft" | "published" | "archived";

export type AdminPageType = "homepage" | "standard" | "legal" | "landing";

export type AdminPageSummary = {
  id: string;
  slug: string;
  title: string;
  pageType: AdminPageType;
  status: AdminPageStatus;
  isIndexed: boolean;
  publishedAt: Date | null;
  updatedAt: Date;
};

export type AdminPageDetail = {
  id: string;
  slug: string;
  title: string;
  pageType: AdminPageType;
  status: AdminPageStatus;
  summary: string | null;
  contentJson: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
  isIndexed: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminPageInput = {
  slug: string;
  title: string;
  pageType: AdminPageType;
  status?: AdminPageStatus;
  summary?: string | null;
  contentJson: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isIndexed?: boolean;
};

export type UpdateAdminPageInput = {
  id: string;
  slug: string;
  title: string;
  pageType: AdminPageType;
  status: AdminPageStatus;
  summary?: string | null;
  contentJson: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isIndexed: boolean;
};

export type AdminPageRepositoryErrorCode =
  | "page_not_found"
  | "page_slug_invalid"
  | "page_title_invalid"
  | "page_content_invalid"
  | "page_slug_conflict";

export class AdminPageRepositoryError extends Error {
  readonly code: AdminPageRepositoryErrorCode;

  constructor(code: AdminPageRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminPageRepositoryError";
    this.code = code;
  }
}
