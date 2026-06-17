import "server-only";

import { db } from "@/core/db";
import {
  resolveApplicableOrderDiscount,
  type ResolvedOrderDiscount,
} from "@/features/commerce/discounts/lib/resolve-order-discount";

export async function resolveCheckoutOrderDiscount(
  cartId: string,
  subtotalCents: number,
  options?: {
    code?: string | null;
    allowAutomatic?: boolean;
    shippingCents?: number;
  }
): Promise<ResolvedOrderDiscount | null> {
  if (cartId.trim().length === 0) {
    return null;
  }

  const cart = await db.cart.findUnique({
    where: { id: cartId },
    select: {
      status: true,
      storeId: true,
      customerId: true,
      currencyCode: true,
      lines: {
        select: {
          quantity: true,
          unitPriceAmount: true,
          productId: true,
          variantId: true,
          product: {
            select: {
              productCategories: {
                select: {
                  categoryId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (cart === null || cart.status !== "ACTIVE") {
    return null;
  }

  return resolveApplicableOrderDiscount({
    executor: db,
    storeId: cart.storeId,
    customerId: cart.customerId,
    code: options?.code ?? null,
    allowAutomatic: options?.allowAutomatic ?? false,
    subtotalCents,
    currencyCode: cart.currencyCode,
    lines: cart.lines.map((line) => ({
      productId: line.productId,
      variantId: line.variantId,
      quantity: line.quantity,
      unitPriceCents: Math.round(Number(line.unitPriceAmount) * 100),
      categoryIds: line.product.productCategories.map((link) => link.categoryId),
    })),
    ...(options?.shippingCents !== undefined ? { shippingCents: options.shippingCents } : {}),
  });
}
