import { prisma } from "@/db/prisma-client";
import type { ProductTxClient } from "@db-products/types/tx";

export async function productExistsInTx(tx: ProductTxClient, productId: string): Promise<boolean> {
  const row = await tx.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  return row !== null;
}

export async function productExists(productId: string): Promise<boolean> {
  const row = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  return row !== null;
}
