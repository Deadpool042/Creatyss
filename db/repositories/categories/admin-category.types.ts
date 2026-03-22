import type { CategoryStatus } from "./category.types";

export type AdminCategorySummary = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  status: CategoryStatus;
  isFeatured: boolean;
  displayOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  representativeMediaId: string | null;
  representativeMediaStorageKey: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminCategoryDetail = AdminCategorySummary;

export type CreateAdminCategoryInput = {
  slug: string;
  name: string;
  description?: string | null;
  status?: CategoryStatus;
  isFeatured?: boolean;
  displayOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  representativeMediaId?: string | null;
};

export type UpdateAdminCategoryInput = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  status?: CategoryStatus;
  isFeatured?: boolean;
  displayOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  representativeMediaId?: string | null;
};

export type AdminCategoryRepositoryErrorCode =
  | "category_not_found"
  | "category_slug_invalid"
  | "category_name_invalid"
  | "category_display_order_invalid"
  | "category_media_invalid"
  | "category_slug_conflict";

export class AdminCategoryRepositoryError extends Error {
  readonly code: AdminCategoryRepositoryErrorCode;

  constructor(code: AdminCategoryRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminCategoryRepositoryError";
    this.code = code;
  }
}
