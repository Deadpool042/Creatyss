import type { ProductPatternDetail } from "@db-products/admin/pattern";
import type { ProductPatternDetailRow } from "@db-products/types/rows";

export function mapProductPatternDetail(row: ProductPatternDetailRow): ProductPatternDetail {
  return {
    productId: row.productId,
    difficultyLevel: row.difficultyLevel,
    estimatedTimeMinutes: row.estimatedTimeMinutes,
    finishedWidthCm: row.finishedWidthCm?.toString() ?? null,
    finishedHeightCm: row.finishedHeightCm?.toString() ?? null,
    finishedDepthCm: row.finishedDepthCm?.toString() ?? null,
    suppliesJson: row.suppliesJson,
    toolsJson: row.toolsJson,
    instructionsSummary: row.instructionsSummary,
    licenseText: row.licenseText,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
