import { mapCart, mapCartRowToCart } from "@db-cart/helpers/mappers/cart.mapper";
import { assertValidCartId } from "@db-cart/helpers/validation/cart.validation";
import type { Cart } from "@db-cart/core/types/cart.types";
import { CartRepositoryError } from "@db-cart/core/types/cart.types";
import { findCartRowById } from "@db-cart/queries/core/cart.queries";

export async function findCartById(cartId: string): Promise<Cart | null> {
  assertValidCartId(cartId);

  const row = await findCartRowById(cartId);

  if (row === null) {
    return null;
  }

  return mapCart(mapCartRowToCart(row));
}

export async function requireCartById(cartId: string): Promise<Cart> {
  const cart = await findCartById(cartId);

  if (cart === null) {
    throw new CartRepositoryError("cart_not_found", "Panier introuvable.");
  }

  return cart;
}
