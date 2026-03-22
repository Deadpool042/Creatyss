import { prisma } from "@/db/prisma-client";
import type { ProductTxClient } from "@db-products/types/tx";
import type { ProductTypeRow } from "@db-products/types/product-type-row";

export async function readProductTypeInTx(
  tx: ProductTxClient,
  productId: string
): Promise<ProductTypeRow | null> {
  const row = await tx.product.findUnique({
    where: { id: productId },
    select: {
      productType: true,
    },
  });

  if (!row) {
    return null;
  }

  return {
    productType: row.productType,
  };
}

export async function readProductType(productId: string): Promise<ProductTypeRow | null> {
  const row = await prisma.product.findUnique({
    where: { id: productId },
    select: {
      productType: true,
    },
  });

  if (!row) {
    return null;
  }

  return {
    productType: row.productType,
  };
}
