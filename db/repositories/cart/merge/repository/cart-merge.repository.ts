import { prisma } from "@db/prisma-client";
import { buildCartLineItemKey } from "@db-cart/helpers/identity/line-identity";
import { parseMergeGuestCartIntoCustomerCartInput } from "@db-cart/helpers/validation/merge.validation";
import {
  CartMergeRepositoryError,
  type CartMergeResult,
  type MergeGuestCartIntoCustomerCartInput,
} from "@db-cart/merge/types/cart-merge.types";

type MergeCartItemRow = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
};

export async function mergeGuestCartIntoCustomerCart(
  input: MergeGuestCartIntoCustomerCartInput
): Promise<CartMergeResult> {
  const parsedInput = parseMergeGuestCartIntoCustomerCartInput(input);

  return prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findFirst({
      where: {
        guestToken: parsedInput.guestToken,
        userId: null,
      },
      select: {
        id: true,
        items: {
          orderBy: [{ createdAt: "asc" }],
          select: {
            id: true,
            productId: true,
            variantId: true,
            quantity: true,
          },
        },
      },
    });

    if (guestCart === null) {
      throw new CartMergeRepositoryError(
        "cart_merge_guest_not_found",
        "Le panier invité à fusionner est introuvable."
      );
    }

    let customerCart = await tx.cart.findFirst({
      where: {
        userId: parsedInput.customerId,
      },
      orderBy: [{ updatedAt: "desc" }],
      select: {
        id: true,
        items: {
          orderBy: [{ createdAt: "asc" }],
          select: {
            id: true,
            productId: true,
            variantId: true,
            quantity: true,
          },
        },
      },
    });

    if (customerCart === null) {
      customerCart = await tx.cart.create({
        data: {
          userId: parsedInput.customerId,
          guestToken: null,
        },
        select: {
          id: true,
          items: {
            orderBy: [{ createdAt: "asc" }],
            select: {
              id: true,
              productId: true,
              variantId: true,
              quantity: true,
            },
          },
        },
      });
    }

    const existingCustomerItemsByKey = new Map<string, MergeCartItemRow>(
      customerCart.items.map((item) => [
        buildCartLineItemKey({
          productId: item.productId,
          productVariantId: item.variantId,
        }),
        item,
      ])
    );

    let mergedLineCount = 0;

    for (const guestItem of guestCart.items) {
      const itemKey = buildCartLineItemKey({
        productId: guestItem.productId,
        productVariantId: guestItem.variantId,
      });

      const existingCustomerItem = existingCustomerItemsByKey.get(itemKey);

      if (existingCustomerItem !== undefined) {
        const nextQuantity = existingCustomerItem.quantity + guestItem.quantity;

        await tx.cartItem.update({
          where: {
            id: existingCustomerItem.id,
          },
          data: {
            quantity: nextQuantity,
          },
        });

        existingCustomerItemsByKey.set(itemKey, {
          ...existingCustomerItem,
          quantity: nextQuantity,
        });
      } else {
        const createdCustomerItem = await tx.cartItem.create({
          data: {
            cartId: customerCart.id,
            productId: guestItem.productId,
            variantId: guestItem.variantId,
            quantity: guestItem.quantity,
          },
          select: {
            id: true,
            productId: true,
            variantId: true,
            quantity: true,
          },
        });

        existingCustomerItemsByKey.set(itemKey, createdCustomerItem);
      }

      mergedLineCount += 1;
    }

    await tx.cart.delete({
      where: {
        id: guestCart.id,
      },
    });

    return {
      customerCartId: customerCart.id,
      mergedLineCount,
      invalidatedGuestCartId: guestCart.id,
    };
  });
}
