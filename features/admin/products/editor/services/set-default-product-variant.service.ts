import { withTransaction } from "@/core/db";
import { assertVariantExists } from "./shared";

type SetDefaultProductVariantServiceInput = {
  productId: string;
  variantId: string;
};

export async function setDefaultProductVariant(
  input: SetDefaultProductVariantServiceInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    await assertVariantExists(tx, input.productId, input.variantId);

    await tx.productVariant.updateMany({
      where: {
        productId: input.productId,
        archivedAt: null,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    return tx.productVariant.update({
      where: {
        id: input.variantId,
      },
      data: {
        isDefault: true,
      },
      select: {
        id: true,
      },
    });
  });
}
