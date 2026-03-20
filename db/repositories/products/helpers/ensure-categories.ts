import type { TxClient } from "../types/tx-client";

export async function ensureCategoriesExistInTx(
  tx: TxClient,
  categoryIds: readonly string[],
  onMissingCategory: () => never
): Promise<string[]> {
  if (categoryIds.length === 0) {
    return [];
  }

  const count = await tx.categories.count({
    where: { id: { in: categoryIds.map(BigInt) } },
  });

  if (count !== categoryIds.length) {
    onMissingCategory();
  }

  return [...categoryIds];
}
