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
    await assertProductExists(tx, input.productId);

    const image = await tx.mediaReference.findFirst({
      where: {
        id: input.imageId,
        archivedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (image === null) {
      throw new AdminProductEditorServiceError("image_missing");
    }

    return tx.mediaReference.update({
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
  });
}
