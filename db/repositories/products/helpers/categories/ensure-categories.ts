import type { ProductTxClient } from "@db-products/types/tx";

export async function ensureCategoriesExistInTx(
  tx: ProductTxClient,
  categoryIds: readonly string[]
): Promise<boolean> {
  if (categoryIds.length === 0) {
    return true;
  }

  const count = await tx.category.count({
    where: {
      id: {
        in: [...categoryIds],
      },
    },
  });

  return count === categoryIds.length;
}
