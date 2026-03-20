import type { TxClient } from "../types/tx-client";

export async function countVariantsInTx(tx: TxClient, productId: string): Promise<number> {
  return tx.product_variants.count({ where: { product_id: BigInt(productId) } });
}
