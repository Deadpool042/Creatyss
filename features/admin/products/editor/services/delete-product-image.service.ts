import { withTransaction } from "@/core/db";
import { AdminProductEditorServiceError, assertProductExists } from "./shared";

type DeleteProductImageServiceInput = {
  productId: string;
  imageId: string;
};

export async function deleteProductImage(
  input: DeleteProductImageServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    const product = await assertProductExists(tx, input.productId);

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

    const archived = await tx.mediaReference.update({
      where: {
        id: input.imageId,
      },
      data: {
        archivedAt: new Date(),
        isActive: false,
      },
      select: {
        id: true,
      },
    });

    if (product.primaryImageId === image.assetId) {
      await tx.product.update({
        where: { id: input.productId },
        data: { primaryImageId: null },
      });
    }

    return archived;
  });
}
