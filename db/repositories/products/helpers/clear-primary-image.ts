import type { TxClient } from "../types/tx-client";

export async function clearPrimaryImageInScopeTx(
  tx: TxClient,
  productId: string,
  variantId: string | null,
  excludedImageId?: string
): Promise<void> {
  if (variantId === null) {
    await tx.product_images.updateMany({
      where: {
        product_id: BigInt(productId),
        variant_id: null,
        is_primary: true,
        ...(excludedImageId ? { NOT: { id: BigInt(excludedImageId) } } : {}),
      },
      data: { is_primary: false },
    });
    return;
  }

  await tx.product_images.updateMany({
    where: {
      variant_id: BigInt(variantId),
      is_primary: true,
      ...(excludedImageId ? { NOT: { id: BigInt(excludedImageId) } } : {}),
    },
    data: { is_primary: false },
  });
}
