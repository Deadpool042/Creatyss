import type { ProductTxClient } from "@db-products/types/tx";

export async function clearPrimaryDeliverableInTx(
  tx: ProductTxClient,
  productId: string
): Promise<void> {
  await tx.productDeliverable.updateMany({
    where: {
      productId,
      isPrimary: true,
    },
    data: {
      isPrimary: false,
    },
  });
}
