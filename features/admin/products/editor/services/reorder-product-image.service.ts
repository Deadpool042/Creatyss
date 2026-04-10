import { withTransaction } from "@/core/db";
import { AdminProductEditorServiceError, assertProductExists } from "./shared";

type ReorderProductImageServiceInput = {
  productId: string;
  imageId: string;
  sortOrder: number;
};

export async function reorderProductImage(
  input: ReorderProductImageServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertProductExists(tx, input.productId);

    const image = await tx.mediaReference.findFirst({
      where: {
        id: input.imageId,
        archivedAt: null,
        OR: [
          {
            subjectType: "PRODUCT",
            subjectId: input.productId,
          },
          {
            subjectType: "PRODUCT_VARIANT",
            subjectId: {
              in: (
                await tx.productVariant.findMany({
                  where: {
                    productId: input.productId,
                    archivedAt: null,
                  },
                  select: {
                    id: true,
                  },
                })
              ).map((variant) => variant.id),
            },
          },
        ],
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
        sortOrder: input.sortOrder,
      },
      select: {
        id: true,
      },
    });
  });
}
