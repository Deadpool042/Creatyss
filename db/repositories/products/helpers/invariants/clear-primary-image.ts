import type { ProductTxClient } from "@db-products/types/tx";

export async function clearPrimaryProductImageInTx(
  tx: ProductTxClient,
  productId: string
): Promise<void> {
  await tx.productImage.updateMany({
    where: {
      productId,
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });
}

export async function clearPrimaryVariantImageInTx(
  tx: ProductTxClient,
  productVariantId: string
): Promise<void> {
  await tx.productVariantImage.updateMany({
    where: {
      productVariantId,
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });
}
