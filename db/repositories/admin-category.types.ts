export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  imagePath: string | null;
  representativeImage: { filePath: string; altText: string | null } | null;
  createdAt: string;
  updatedAt: string;
};

type CategoryRepositoryErrorCode = "slug_taken" | "category_referenced";

export class AdminCategoryRepositoryError extends Error {
  readonly code: CategoryRepositoryErrorCode;

  constructor(code: CategoryRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
