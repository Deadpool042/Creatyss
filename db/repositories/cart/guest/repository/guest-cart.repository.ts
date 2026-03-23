import { createCart } from "@db-cart/core";
import { mapGuestCart } from "@db-cart/helpers/mappers";
import { findGuestCartRowById } from "@db-cart/queries/cart.queries";
import type { CreateGuestCartInput, GuestCart } from "@db-cart/guest/types/guest-cart.types";

export async function findGuestCartById(id: string): Promise<GuestCart | null> {
  const row = await findGuestCartRowById(id.trim());
  return row ? mapGuestCart(row) : null;
}

export async function createGuestCart(input: CreateGuestCartInput): Promise<GuestCart> {
  const cart = await createCart(input);
  return cart as GuestCart;
}
