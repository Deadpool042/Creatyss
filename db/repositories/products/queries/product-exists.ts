import type { TxClient } from "../types/tx-client";

export async function productExistsInTx(tx: TxClient, productId: string): Promise<boolean> {
  return (await tx.products.count({ where: { id: BigInt(productId) } })) > 0;
}
