import { prisma } from "@/db/prisma-client";
import type { ProductTxClient } from "@db-products/types/tx";

export async function countVariantsInTx(tx: ProductTxClient, productId: string): Promise<number> {
  return tx.productVariant.count({
    where: {
      productId,
    },
  });
}

export async function countVariants(productId: string): Promise<number> {
  return prisma.productVariant.count({
    where: {
      productId,
    },
  });
}
