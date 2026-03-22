import { prisma } from "@/db/prisma-client";
import type { ProductTxClient } from "@db-products/types/tx";

export async function variantExistsInTx(tx: ProductTxClient, variantId: string): Promise<boolean> {
  const row = await tx.productVariant.findUnique({
    where: { id: variantId },
    select: { id: true },
  });

  return row !== null;
}

export async function variantExists(variantId: string): Promise<boolean> {
  const row = await prisma.productVariant.findUnique({
    where: { id: variantId },
    select: { id: true },
  });

  return row !== null;
}
