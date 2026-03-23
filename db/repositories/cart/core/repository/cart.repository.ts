import { prisma } from "@/db/prisma-client";
import { mapCart } from "@db-cart/helpers/mappers";
import {
  parseAddCartLineInput,
  parseCreateCartInput,
  parseUpdateCartLineQuantityInput,
} from "@db-cart/helpers/validation";
import { findCartRowById } from "@db-cart/queries/cart.queries";
import type {
  AddCartLineInput,
  Cart,
  CreateCartInput,
  UpdateCartLineQuantityInput,
} from "@db-cart/core/types/cart.types";

async function ensureVariantExists(variantId: string): Promise<void> {
  const variant = await prisma.productVariant.findUnique({
    where: {
      id: variantId,
    },
    select: {
      id: true,
    },
  });

  if (!variant) {
    throw new Error("Product variant not found.");
  }
}

export async function findCartById(id: string): Promise<Cart | null> {
  const row = await findCartRowById(id.trim());
  return row ? mapCart(row) : null;
}

export async function createCart(input: CreateCartInput): Promise<Cart> {
  const parsedInput = parseCreateCartInput(input);

  const created = await prisma.cart.create({
    data: {
      storeId: parsedInput.storeId,
      customerId: parsedInput.customerId ?? null,
      currencyCode: parsedInput.currencyCode as never,
      email: parsedInput.email ?? null,
      expiresAt: parsedInput.expiresAt ?? null,
    },
    select: {
      id: true,
    },
  });

  const row = await findCartRowById(created.id);

  if (!row) {
    throw new Error("Cart not found after create.");
  }

  return mapCart(row);
}

export async function addCartLine(input: AddCartLineInput): Promise<Cart | null> {
  const parsedInput = parseAddCartLineInput(input);
  await ensureVariantExists(parsedInput.variantId);

  await prisma.cartLine.upsert({
    where: {
      cartId_variantId: {
        cartId: parsedInput.cartId,
        variantId: parsedInput.variantId,
      },
    },
    update: {
      quantity: {
        increment: parsedInput.quantity,
      },
    },
    create: {
      cartId: parsedInput.cartId,
      variantId: parsedInput.variantId,
      quantity: parsedInput.quantity,
    },
    select: {
      id: true,
    },
  });

  const row = await findCartRowById(parsedInput.cartId);
  return row ? mapCart(row) : null;
}

export async function updateCartLineQuantity(
  input: UpdateCartLineQuantityInput
): Promise<Cart | null> {
  const parsedInput = parseUpdateCartLineQuantityInput(input);

  const updated = await prisma.cartLine.updateMany({
    where: {
      id: parsedInput.lineId,
      cartId: parsedInput.cartId,
    },
    data: {
      quantity: parsedInput.quantity,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findCartRowById(parsedInput.cartId);
  return row ? mapCart(row) : null;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart | null> {
  const normalizedCartId = cartId.trim();
  const normalizedLineId = lineId.trim();

  const deleted = await prisma.cartLine.deleteMany({
    where: {
      id: normalizedLineId,
      cartId: normalizedCartId,
    },
  });

  if (deleted.count === 0) {
    return null;
  }

  const row = await findCartRowById(normalizedCartId);
  return row ? mapCart(row) : null;
}
