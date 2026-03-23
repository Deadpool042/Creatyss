import { prisma } from "@/db/prisma-client";
import { mapCustomerCart } from "@db-cart/helpers/mappers";
import {
  findActiveCustomerCartRowByCustomerId,
  findCartRowById,
  findGuestCartRowById,
} from "@db-cart/queries/cart.queries";
import type { CustomerCart } from "@db-cart/customer";
import type {
  CartMergeResult,
  MergeGuestCartIntoCustomerCartInput,
} from "@db-cart/merge/types/cart-merge.types";

async function ensureActiveCustomerCart(
  customerId: string,
  guestCart: Awaited<ReturnType<typeof findGuestCartRowById>>
): Promise<CustomerCart> {
  const existingRow = await findActiveCustomerCartRowByCustomerId(customerId);

  if (existingRow) {
    return mapCustomerCart(existingRow);
  }

  const created = await prisma.cart.create({
    data: {
      storeId: guestCart?.storeId as string,
      customerId,
      currencyCode: guestCart?.currencyCode as never,
      email: guestCart?.email ?? null,
    },
    select: {
      id: true,
    },
  });

  const row = await findCartRowById(created.id);

  if (!row) {
    throw new Error("Customer cart not found after create.");
  }

  return mapCustomerCart(row);
}

export async function mergeGuestCartIntoCustomerCart(
  input: MergeGuestCartIntoCustomerCartInput
): Promise<CartMergeResult | null> {
  const guestCartId = input.guestCartId.trim();
  const customerId = input.customerId.trim();

  const guestCart = await findGuestCartRowById(guestCartId);

  if (!guestCart) {
    return null;
  }

  const customerCart = await ensureActiveCustomerCart(customerId, guestCart);

  await prisma.$transaction(async (tx) => {
    for (const line of guestCart.lines) {
      await tx.cartLine.upsert({
        where: {
          cartId_variantId: {
            cartId: customerCart.id,
            variantId: line.variantId,
          },
        },
        update: {
          quantity: {
            increment: line.quantity,
          },
        },
        create: {
          cartId: customerCart.id,
          variantId: line.variantId,
          quantity: line.quantity,
        },
      });
    }

    await tx.cart.delete({
      where: {
        id: guestCartId,
      },
    });
  });

  const mergedCartRow = await findCartRowById(customerCart.id);

  if (!mergedCartRow) {
    throw new Error("Merged cart not found after transaction.");
  }

  return {
    cart: mapCustomerCart(mergedCartRow),
    mergedLineCount: guestCart.lines.length,
    deletedGuestCartId: guestCartId,
  };
}
