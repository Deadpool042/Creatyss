import type { ProductTxClient } from "@db-products/types/tx";

export async function clearDefaultVariantInTx(
  tx: ProductTxClient,
  productId: string
): Promise<void> {
  await tx.productVariant.updateMany({
    where: {
      productId,
      isDefault: true,
    },
    data: {
      isDefault: false,
    },
  });
}
