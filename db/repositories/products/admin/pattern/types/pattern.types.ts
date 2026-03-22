export type ProductPatternDetail = {
  productId: string;
  difficultyLevel: string | null;
  estimatedTimeMinutes: number | null;
  finishedWidthCm: string | null;
  finishedHeightCm: string | null;
  finishedDepthCm: string | null;
  suppliesJson: unknown;
  toolsJson: unknown;
  instructionsSummary: string | null;
  licenseText: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UpsertAdminProductPatternDetailInput = {
  productId: string;
  difficultyLevel?: string | null;
  estimatedTimeMinutes?: number | null;
  finishedWidthCm?: string | null;
  finishedHeightCm?: string | null;
  finishedDepthCm?: string | null;
  suppliesJson?: unknown;
  toolsJson?: unknown;
  instructionsSummary?: string | null;
  licenseText?: string | null;
};

export type AdminProductPatternRepositoryErrorCode =
  | "product_pattern_product_not_found"
  | "product_pattern_invalid"
  | "product_pattern_estimated_time_invalid"
  | "product_pattern_dimensions_invalid"
  | "product_pattern_kind_mismatch";

export class AdminProductPatternRepositoryError extends Error {
  readonly code: AdminProductPatternRepositoryErrorCode;

  constructor(code: AdminProductPatternRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminProductPatternRepositoryError";
    this.code = code;
  }
}
