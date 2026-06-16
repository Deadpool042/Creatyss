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
      currencyCode: true,
    },
  });

  if (cart === null || cart.status !== "ACTIVE") {
    return null;
  }

  return resolveApplicableOrderDiscount({
    executor: db,
    storeId: cart.storeId,
    code: options?.code ?? null,
    allowAutomatic: options?.allowAutomatic ?? false,
    subtotalCents,
    currencyCode: cart.currencyCode,
  });
}
