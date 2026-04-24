import { withTransaction } from "@/core/db";
import {
  ensureDefaultVariantExists,
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
    await assertVariantExists(tx, input.productId, input.variantId);

    const archived = await tx.productVariant.update({
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

    await ensureDefaultVariantExists(tx, { productId: input.productId });

    return archived;
  });
}
