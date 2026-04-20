import { withTransaction } from "@/core/db";
import {
  assertMediaAssetExists,
  assertProductExists,
  assertVariantExists,
  mapEditorRoleToPrismaRole,
  mapEditorSubjectTypeToPrismaSubjectType,
} from "./shared";

type AttachProductImageInput = {
  productId: string;
  mediaAssetId: string;
  subjectType: "product" | "product_variant";
  subjectId: string;
  role: "gallery" | "thumbnail" | "other";
  sortOrder: number;
};

type AttachProductImagesServiceInput = {
  images: readonly AttachProductImageInput[];
};

export async function attachProductImages(
  input: AttachProductImagesServiceInput
): Promise<{ count: number }> {
  return withTransaction(async (tx) => {
    for (const image of input.images) {
      await assertProductExists(tx, image.productId);
      await assertMediaAssetExists(tx, image.mediaAssetId);

      if (image.subjectType === "product_variant") {
        await assertVariantExists(tx, image.productId, image.subjectId);
      }
    }

    for (const image of input.images) {
      await tx.mediaReference.create({
        data: {
          assetId: image.mediaAssetId,
          subjectType: mapEditorSubjectTypeToPrismaSubjectType(image.subjectType),
          subjectId: image.subjectId,
          role: mapEditorRoleToPrismaRole(image.role),
          sortOrder: image.sortOrder,
          isPrimary: false,
          isActive: true,
        },
      });
    }

    return {
      count: input.images.length,
    };
  });
}
