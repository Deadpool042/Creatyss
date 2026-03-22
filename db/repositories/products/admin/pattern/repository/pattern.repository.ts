import { prisma } from "@/db/prisma-client";
import {
  AdminProductPatternRepositoryError,
  type ProductPatternDetail,
  type UpsertAdminProductPatternDetailInput,
} from "@db-products/admin/pattern";
import { type ProductPatternDetailRow } from "@db-products/types/rows";
import { findAdminProductPatternDetailRowByProductId } from "@db-products/queries/pattern";
import { parseUpsertAdminProductPatternDetailInput } from "@db-products/helpers/validation";
import { upsertProductPatternDetailInTx } from "@db-products/helpers/transactions";

function mapProductPatternDetail(row: ProductPatternDetailRow): ProductPatternDetail {
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

function mapPatternTransactionError(error: unknown): never {
  if (error instanceof Error && error.message === "PRODUCT_PATTERN_PRODUCT_NOT_FOUND") {
    throw new AdminProductPatternRepositoryError(
      "product_pattern_product_not_found",
      "Produit patron introuvable."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_PATTERN_KIND_MISMATCH") {
    throw new AdminProductPatternRepositoryError(
      "product_pattern_kind_mismatch",
      "La fiche patron est interdite pour un produit physique."
    );
  }

  throw error;
}

export async function findAdminProductPatternDetailByProductId(
  productId: string
): Promise<ProductPatternDetail | null> {
  const row = await findAdminProductPatternDetailRowByProductId(productId);
  return row ? mapProductPatternDetail(row) : null;
}

export async function upsertAdminProductPatternDetail(
  input: UpsertAdminProductPatternDetailInput
): Promise<ProductPatternDetail> {
  const parsedInput = parseUpsertAdminProductPatternDetailInput(input);

  try {
    const productId = await prisma.$transaction((tx) =>
      upsertProductPatternDetailInTx(tx, parsedInput)
    );

    const row = await findAdminProductPatternDetailRowByProductId(productId);

    if (!row) {
      throw new AdminProductPatternRepositoryError(
        "product_pattern_invalid",
        "Détail patron introuvable."
      );
    }

    return mapProductPatternDetail(row);
  } catch (error) {
    mapPatternTransactionError(error);
  }
}
