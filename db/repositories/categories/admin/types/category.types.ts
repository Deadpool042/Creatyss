import type {
  CategoryDetail,
  CategoryRepositoryError,
  CategoryStatus,
  CategorySummary,
} from "@db-categories/public";

export type AdminCategorySummary = CategorySummary;
export type AdminCategoryDetail = CategoryDetail;

export type CreateAdminCategoryInput = {
  storeId: string;
  parentId?: string | null;
  slug: string;
  name: string;
  description?: string | null;
  status?: CategoryStatus;
  sortOrder?: number;
  isFeatured?: boolean;
};

export type UpdateAdminCategoryInput = {
  id: string;
  parentId?: string | null;
  slug?: string;
  name?: string;
  description?: string | null;
  status?: CategoryStatus;
  sortOrder?: number;
  isFeatured?: boolean;
};

export class AdminCategoryRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "AdminCategoryRepositoryError";
    this.code = code;
  }
}

export type CategoryRepositoryFailure = CategoryRepositoryError | AdminCategoryRepositoryError;
