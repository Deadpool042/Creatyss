import { withTransaction } from "@/core/db";
import {
  AdminProductEditorServiceError,
  assertVariantExists,
} from "./shared";

type DeleteProductVariantServiceInput = {
  productId: string;
  variantId: string;
};

export async function deleteProductVariant(
  input: DeleteProductVariantServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    const variant = await assertVariantExists(tx, input.productId, input.variantId);

    if (variant.isDefault) {
      const siblingCount = await tx.productVariant.count({
        where: {
          productId: input.productId,
          archivedAt: null,
        },
      });

      if (siblingCount > 1) {
        throw new AdminProductEditorServiceError("cannot_delete_default_variant");
      }
    }

    return tx.productVariant.update({
      where: {
        id: input.variantId,
      },
      data: {
        archivedAt: new Date(),
        status: "ARCHIVED",
        isDefault: false,
      },
      select: {
        id: true,
      },
    });
  });
}
