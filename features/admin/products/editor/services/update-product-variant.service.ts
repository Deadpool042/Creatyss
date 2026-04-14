import { withTransaction } from "@/core/db";
import {
  assertMediaAssetExists,
  assertVariantExists,
  assertVariantOptionValuesAreValid,
  mapEditorVariantStatusToPrismaStatus,
} from "./shared";

type UpdateProductVariantServiceInput = {
  productId: string;
  variantId: string;
  sku: string;
  slug: string | null;
  name: string | null;
  primaryImageId: string | null;
  status: "draft" | "active" | "inactive" | "archived";
  isDefault: boolean;
  sortOrder: number;
  barcode: string | null;
  externalReference: string | null;
  weightGrams: number | null;
  widthMm: number | null;
  heightMm: number | null;
  depthMm: number | null;
  optionValueIds: string[];
};

export async function updateProductVariant(
  input: UpdateProductVariantServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertVariantExists(tx, input.productId, input.variantId);
    await assertVariantOptionValuesAreValid(tx, input.productId, input.optionValueIds);

    if (input.primaryImageId !== null) {
      await assertMediaAssetExists(tx, input.primaryImageId);
    }

    if (input.isDefault) {
      await tx.productVariant.updateMany({
        where: {
          productId: input.productId,
          archivedAt: null,
          isDefault: true,
          id: {
            not: input.variantId,
          },
        },
        data: {
          isDefault: false,
        },
      });
    }

    const updated = await tx.productVariant.update({
      where: {
        id: input.variantId,
      },
      data: {
        sku: input.sku,
        slug: input.slug,
        name: input.name,
        primaryImageId: input.primaryImageId,
        status: mapEditorVariantStatusToPrismaStatus(input.status),
        isDefault: input.isDefault,
        sortOrder: input.sortOrder,
        barcode: input.barcode,
        externalReference: input.externalReference,
        weightGrams: input.weightGrams,
        widthMm: input.widthMm,
        heightMm: input.heightMm,
        depthMm: input.depthMm,
        publishedAt: input.status === "active" ? new Date() : null,
      },
      select: {
        id: true,
      },
    });

    // Sync ciblé : supprime uniquement les associations isVariantAxis=true
    // pour préserver les associations hors périmètre UI (isVariantAxis=false)
    await tx.productVariantOptionValue.deleteMany({
      where: {
        variantId: input.variantId,
        optionValue: {
          option: {
            isVariantAxis: true,
          },
        },
      },
    });

    if (input.optionValueIds.length > 0) {
      await tx.productVariantOptionValue.createMany({
        data: input.optionValueIds.map((optionValueId) => ({
          variantId: input.variantId,
          optionValueId,
        })),
        skipDuplicates: true,
      });
    }

    return updated;
  });
}
