import { z } from "zod";
import {
  AdminProductPatternRepositoryError,
  type UpsertAdminProductPatternDetailInput,
} from "@db-products/admin/pattern";

const idSchema = z.string().trim().min(1);
const decimalStringSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/);

const upsertAdminProductPatternDetailInputSchema = z.object({
  productId: idSchema,
  difficultyLevel: z.string().trim().nullable().optional(),
  estimatedTimeMinutes: z.number().int().min(0).nullable().optional(),
  finishedWidthCm: decimalStringSchema.nullable().optional(),
  finishedHeightCm: decimalStringSchema.nullable().optional(),
  finishedDepthCm: decimalStringSchema.nullable().optional(),
  suppliesJson: z.unknown().optional(),
  toolsJson: z.unknown().optional(),
  instructionsSummary: z.string().trim().nullable().optional(),
  licenseText: z.string().trim().nullable().optional(),
});

export function parseUpsertAdminProductPatternDetailInput(
  input: UpsertAdminProductPatternDetailInput
): UpsertAdminProductPatternDetailInput {
  const result = upsertAdminProductPatternDetailInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "productId":
        throw new AdminProductPatternRepositoryError(
          "product_pattern_product_not_found",
          "Produit patron introuvable."
        );
      case "estimatedTimeMinutes":
        throw new AdminProductPatternRepositoryError(
          "product_pattern_estimated_time_invalid",
          "Temps estimé invalide."
        );
      case "finishedWidthCm":
      case "finishedHeightCm":
      case "finishedDepthCm":
        throw new AdminProductPatternRepositoryError(
          "product_pattern_dimensions_invalid",
          "Dimensions du patron invalides."
        );
      default:
        throw new AdminProductPatternRepositoryError(
          "product_pattern_invalid",
          "Les données du patron sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: UpsertAdminProductPatternDetailInput = {
    productId: data.productId,
  };

  if (data.difficultyLevel !== undefined) {
    parsed.difficultyLevel = data.difficultyLevel;
  }
  if (data.estimatedTimeMinutes !== undefined) {
    parsed.estimatedTimeMinutes = data.estimatedTimeMinutes;
  }
  if (data.finishedWidthCm !== undefined) {
    parsed.finishedWidthCm = data.finishedWidthCm;
  }
  if (data.finishedHeightCm !== undefined) {
    parsed.finishedHeightCm = data.finishedHeightCm;
  }
  if (data.finishedDepthCm !== undefined) {
    parsed.finishedDepthCm = data.finishedDepthCm;
  }
  if (data.suppliesJson !== undefined) {
    parsed.suppliesJson = data.suppliesJson;
  }
  if (data.toolsJson !== undefined) {
    parsed.toolsJson = data.toolsJson;
  }
  if (data.instructionsSummary !== undefined) {
    parsed.instructionsSummary = data.instructionsSummary;
  }
  if (data.licenseText !== undefined) {
    parsed.licenseText = data.licenseText;
  }

  return parsed;
}
