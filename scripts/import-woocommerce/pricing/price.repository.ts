import type { DbClient } from "../shared/db";

export async function createProductPrice(
  prisma: DbClient,
  input: {
    priceListId: string;
    productId: string;
    amount: string;
    compareAtAmount: string | null;
  }
) {
  return prisma.productPrice.create({
    data: {
      priceListId: input.priceListId,
      productId: input.productId,
      amount: input.amount,
      compareAtAmount: input.compareAtAmount,
      isActive: true,
    },
    select: {
      id: true,
      amount: true,
      compareAtAmount: true,
    },
  });
}

export async function createVariantPrice(
  prisma: DbClient,
  input: {
    priceListId: string;
    variantId: string;
    amount: string;
    compareAtAmount: string | null;
  }
) {
  return prisma.productVariantPrice.create({
    data: {
      priceListId: input.priceListId,
      variantId: input.variantId,
      amount: input.amount,
      compareAtAmount: input.compareAtAmount,
      isActive: true,
    },
    select: {
      id: true,
      amount: true,
      compareAtAmount: true,
    },
  });
}
