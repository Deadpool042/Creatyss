import type { PageDetail, PageSectionKind, PageStatus, PageSummary } from "@db-pages/public";

export type AdminPageSummary = PageSummary;
export type AdminPageDetail = PageDetail;

export type AdminPageSectionInput = {
  kind: PageSectionKind;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  imageAssetId?: string | null;
  sortOrder?: number;
  isEnabled?: boolean;
};

export type CreateAdminPageInput = {
  storeId: string;
  slug: string;
  title: string;
  description?: string | null;
  status?: PageStatus;
  isHomepage?: boolean;
  sections?: AdminPageSectionInput[];
};

export type UpdateAdminPageInput = {
  id: string;
  slug?: string;
  title?: string;
  description?: string | null;
  status?: PageStatus;
  isHomepage?: boolean;
  sections?: AdminPageSectionInput[];
};

export class AdminPageRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AdminPageRepositoryError";
    this.code = code;
  }
}
