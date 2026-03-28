import type { DbClient } from "../shared/db";

export async function replaceProductPrice(
  prisma: DbClient,
  input: {
    priceListId: string;
    productId: string;
    amount: string;
    compareAtAmount: string | null;
  }
) {
  await prisma.productPrice.deleteMany({
    where: {
      priceListId: input.priceListId,
      productId: input.productId,
    },
  });

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

export async function replaceVariantPrice(
  prisma: DbClient,
  input: {
    priceListId: string;
    variantId: string;
    amount: string;
    compareAtAmount: string | null;
  }
) {
  await prisma.productVariantPrice.deleteMany({
    where: {
      priceListId: input.priceListId,
      variantId: input.variantId,
    },
  });

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
