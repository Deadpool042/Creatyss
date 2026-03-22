import type { ProductTxClient } from "@db-products/types/tx";

export async function replaceProductCategoriesInTx(
  tx: ProductTxClient,
  productId: string,
  categoryIds: readonly string[]
): Promise<void> {
  await tx.productCategory.deleteMany({
    where: {
      productId,
    },
  });

  if (categoryIds.length === 0) {
    return;
  }

  await tx.productCategory.createMany({
    data: categoryIds.map((categoryId) => ({
      productId,
      categoryId,
    })),
  });
}
