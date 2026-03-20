import type { TxClient } from "../types/tx-client";

export async function replaceProductCategoriesInTx(
  tx: TxClient,
  productId: string,
  categoryIds: readonly string[]
): Promise<void> {
  await tx.product_categories.deleteMany({ where: { product_id: BigInt(productId) } });

  if (categoryIds.length > 0) {
    await tx.product_categories.createMany({
      data: categoryIds.map((categoryId) => ({
        product_id: BigInt(productId),
        category_id: BigInt(categoryId),
      })),
    });
  }
}
