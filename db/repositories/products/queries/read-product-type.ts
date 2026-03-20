import type { TxClient } from "../types/tx-client";
import type { ProductTypeRow } from "../types/product-type-row";
import type { ProductType } from "@/entities/product/product-input";

export async function readProductTypeInTx(
  tx: TxClient,
  productId: string
): Promise<ProductTypeRow | null> {
  const row = await tx.products.findUnique({
    where: { id: BigInt(productId) },
    select: { id: true, product_type: true },
  });

  if (row === null) {
    return null;
  }

  return { id: row.id.toString(), product_type: row.product_type as ProductType };
}
