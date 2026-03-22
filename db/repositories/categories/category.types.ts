export type CategoryStatus = "active" | "hidden";

export type CategorySummary = {
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

export type CategoryDetail = CategorySummary;

export type CategoryRepositoryErrorCode = "category_not_found" | "category_slug_invalid";

export class CategoryRepositoryError extends Error {
  readonly code: CategoryRepositoryErrorCode;

  constructor(code: CategoryRepositoryErrorCode, message: string) {
    super(message);
    this.name = "CategoryRepositoryError";
    this.code = code;
  }
}
