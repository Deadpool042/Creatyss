"use server";

import { redirect } from "next/navigation";
import {
  findGuestCartIdByToken,
  removeGuestCartItem,
} from "@/db/repositories/guest-cart.repository";
import { readCartSessionToken } from "@/lib/cart-session";

function normalizeCartItemId(value: FormDataEntryValue | string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  if (!/^[0-9]+$/.test(normalizedValue)) {
    return null;
  }

  return normalizedValue;
}

export async function removeCartItemAction(formData: FormData): Promise<void> {
  const itemId = normalizeCartItemId(formData.get("itemId"));

  if (itemId === null) {
    redirect("/panier?error=missing_cart_item");
  }

  const cartToken = await readCartSessionToken();

  if (cartToken === null) {
    redirect("/panier?error=missing_cart");
  }

  const cartId = await findGuestCartIdByToken(cartToken);

  if (cartId === null) {
    redirect("/panier?error=missing_cart");
  }

  try {
    const removed = await removeGuestCartItem({
      cartId,
      itemId,
    });

    if (!removed) {
      redirect("/panier?error=missing_cart_item");
    }
  } catch (error) {
    console.error(error);
    redirect("/panier?error=save_failed");
  }

  redirect("/panier?status=removed");
}
