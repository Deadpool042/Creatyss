import type { ProductTxClient } from "@db-products/types/tx";

export async function readProductKindInTx(
  tx: ProductTxClient,
  productId: string
): Promise<"physical" | "digital" | "hybrid" | null> {
  const row = await tx.product.findUnique({
    where: { id: productId },
    select: {
      productKind: true,
    },
  });

  return row?.productKind ?? null;
}

export async function hasPrimaryActiveDeliverableInTx(
  tx: ProductTxClient,
  productId: string
): Promise<boolean> {
  const row = await tx.productDeliverable.findFirst({
    where: {
      productId,
      isPrimary: true,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  return row !== null;
}

export async function hasPatternDetailInTx(
  tx: ProductTxClient,
  productId: string
): Promise<boolean> {
  const row = await tx.productPatternDetail.findUnique({
    where: {
      productId,
    },
    select: {
      productId: true,
    },
  });

  return row !== null;
}
