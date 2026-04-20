import { withTransaction } from "@/core/db";

import { AdminProductEditorServiceError, assertProductExists } from "./shared";

type UpdateProductImageAltTextServiceInput = {
  productId: string;
  imageId: string;
  altText: string;
};

export async function updateProductImageAltText(
  input: UpdateProductImageAltTextServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    const image = await tx.mediaReference.findFirst({
      where: {
        id: input.imageId,
        archivedAt: null,
      },
      select: {
        id: true,
        assetId: true,
      },
    });

    if (image === null) {
      throw new AdminProductEditorServiceError("image_missing");
    }

    await tx.mediaAsset.update({
      where: { id: image.assetId },
      data: { altText: input.altText || null },
    });

    return { id: image.id };
  });
}
