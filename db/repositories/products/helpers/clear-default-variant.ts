import type { TxClient } from "../types/tx-client";

export async function clearDefaultVariantInTx(
  tx: TxClient,
  productId: string,
  excludedVariantId?: string
): Promise<void> {
  await tx.product_variants.updateMany({
    where: {
      product_id: BigInt(productId),
      is_default: true,
      ...(excludedVariantId ? { NOT: { id: BigInt(excludedVariantId) } } : {}),
    },
    data: { is_default: false },
  });
}
