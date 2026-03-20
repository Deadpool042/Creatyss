import type { TxClient } from "../types/tx-client";

export async function variantExistsInTx(
  tx: TxClient,
  productId: string,
  variantId: string
): Promise<boolean> {
  return (
    (await tx.product_variants.count({
      where: { id: BigInt(variantId), product_id: BigInt(productId) },
    })) > 0
  );
}
