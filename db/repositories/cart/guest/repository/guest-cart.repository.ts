import { mapCartRowToCart } from "@db-cart/helpers/mappers/cart.mapper";
import { mapGuestCart } from "@db-cart/helpers/mappers/guest-cart.mapper";
import { parseGuestCartToken } from "@db-cart/helpers/validation/guest-cart.validation";
import { GuestCartRepositoryError, type GuestCart } from "@db-cart/guest/types/guest-cart.types";
import { findGuestCartRowByToken } from "@db-cart/queries/guest/guest-cart.queries";

export async function findGuestCartByToken(guestToken: string): Promise<GuestCart | null> {
  const normalizedGuestToken = parseGuestCartToken(guestToken);
  const row = await findGuestCartRowByToken(normalizedGuestToken);

  if (row === null) {
    return null;
  }

  return mapGuestCart(mapCartRowToCart(row) as GuestCart);
}

export async function requireGuestCartByToken(guestToken: string): Promise<GuestCart> {
  const cart = await findGuestCartByToken(guestToken);

  if (cart === null) {
    throw new GuestCartRepositoryError("guest_cart_not_found", "Le panier invité est introuvable.");
  }

  return cart;
}
