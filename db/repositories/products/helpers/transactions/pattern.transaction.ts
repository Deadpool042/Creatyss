import { Prisma } from "@prisma/client";
import type { UpsertAdminProductPatternDetailInput } from "@db-products/admin/pattern";
import { productExistsInTx } from "@db-products/queries/product";
import type { ProductTxClient } from "@db-products/types/tx";
import { assertProductPublicationRulesInTx } from "./publication.transaction";

export async function upsertProductPatternDetailInTx(
  tx: ProductTxClient,
  input: UpsertAdminProductPatternDetailInput
): Promise<string> {
  const exists = await productExistsInTx(tx, input.productId);

  if (!exists) {
    throw new Error("PRODUCT_PATTERN_PRODUCT_NOT_FOUND");
  }

  const productRow = await tx.product.findUnique({
    where: {
      id: input.productId,
    },
    select: {
      status: true,
      productKind: true,
    },
  });

  if (!productRow) {
    throw new Error("PRODUCT_PATTERN_PRODUCT_NOT_FOUND");
  }

  if (productRow.productKind === "physical") {
    throw new Error("PRODUCT_PATTERN_KIND_MISMATCH");
  }

  const createData: {
    productId: string;
    difficultyLevel: string | null;
    estimatedTimeMinutes: number | null;
    finishedWidthCm: Prisma.Decimal | null;
    finishedHeightCm: Prisma.Decimal | null;
    finishedDepthCm: Prisma.Decimal | null;
    suppliesJson: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
    toolsJson: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
    instructionsSummary: string | null;
    licenseText: string | null;
  } = {
    productId: input.productId,
    difficultyLevel: input.difficultyLevel ?? null,
    estimatedTimeMinutes: input.estimatedTimeMinutes ?? null,
    finishedWidthCm:
      input.finishedWidthCm !== undefined && input.finishedWidthCm !== null
        ? new Prisma.Decimal(input.finishedWidthCm)
        : null,
    finishedHeightCm:
      input.finishedHeightCm !== undefined && input.finishedHeightCm !== null
        ? new Prisma.Decimal(input.finishedHeightCm)
        : null,
    finishedDepthCm:
      input.finishedDepthCm !== undefined && input.finishedDepthCm !== null
        ? new Prisma.Decimal(input.finishedDepthCm)
        : null,
    suppliesJson:
      input.suppliesJson === undefined
        ? Prisma.JsonNull
        : (input.suppliesJson as Prisma.InputJsonValue),
    toolsJson:
      input.toolsJson === undefined ? Prisma.JsonNull : (input.toolsJson as Prisma.InputJsonValue),
    instructionsSummary: input.instructionsSummary ?? null,
    licenseText: input.licenseText ?? null,
  };

  const updateData: {
    difficultyLevel?: string | null;
    estimatedTimeMinutes?: number | null;
    finishedWidthCm?: Prisma.Decimal | null;
    finishedHeightCm?: Prisma.Decimal | null;
    finishedDepthCm?: Prisma.Decimal | null;
    suppliesJson?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
    toolsJson?: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;
    instructionsSummary?: string | null;
    licenseText?: string | null;
  } = {};

  if (input.difficultyLevel !== undefined) {
    updateData.difficultyLevel = input.difficultyLevel;
  }

  if (input.estimatedTimeMinutes !== undefined) {
    updateData.estimatedTimeMinutes = input.estimatedTimeMinutes;
  }

  if (input.finishedWidthCm !== undefined) {
    updateData.finishedWidthCm =
      input.finishedWidthCm === null ? null : new Prisma.Decimal(input.finishedWidthCm);
  }

  if (input.finishedHeightCm !== undefined) {
    updateData.finishedHeightCm =
      input.finishedHeightCm === null ? null : new Prisma.Decimal(input.finishedHeightCm);
  }

  if (input.finishedDepthCm !== undefined) {
    updateData.finishedDepthCm =
      input.finishedDepthCm === null ? null : new Prisma.Decimal(input.finishedDepthCm);
  }

  if (input.suppliesJson !== undefined) {
    updateData.suppliesJson =
      input.suppliesJson === null ? Prisma.JsonNull : (input.suppliesJson as Prisma.InputJsonValue);
  }

  if (input.toolsJson !== undefined) {
    updateData.toolsJson =
      input.toolsJson === null ? Prisma.JsonNull : (input.toolsJson as Prisma.InputJsonValue);
  }

  if (input.instructionsSummary !== undefined) {
    updateData.instructionsSummary = input.instructionsSummary;
  }

  if (input.licenseText !== undefined) {
    updateData.licenseText = input.licenseText;
  }

  const upserted = await tx.productPatternDetail.upsert({
    where: {
      productId: input.productId,
    },
    create: createData,
    update: updateData,
    select: {
      productId: true,
    },
  });

  await assertProductPublicationRulesInTx(tx, {
    productId: input.productId,
    status: productRow.status,
    productKind: productRow.productKind,
  });

  return upserted.productId;
}
