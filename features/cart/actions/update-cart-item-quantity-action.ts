"use server";

import { redirect } from "next/navigation";
import {
  findGuestCartIdByToken,
  findGuestCartItemById,
  findGuestCartVariantById,
  updateGuestCartItemQuantity,
} from "@/features/cart/lib/guest-cart.repository";
import { validateCartItemInput } from "@/entities/cart/cart-item-input";
import { readCartSessionToken } from "@/core/sessions/cart";

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

export async function updateCartItemQuantityAction(formData: FormData): Promise<void> {
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

  const existingItem = await findGuestCartItemById(cartId, itemId);

  if (existingItem === null) {
    redirect("/panier?error=missing_cart_item");
  }

  const validation = validateCartItemInput({
    variantId: existingItem.variantId,
    quantity: formData.get("quantity"),
  });

  if (!validation.ok) {
    redirect(`/panier?error=${validation.code}`);
  }

  const variant = await findGuestCartVariantById(existingItem.variantId);

  if (variant === null) {
    redirect("/panier?error=missing_variant");
  }

  if (variant.productStatus !== "published" || variant.status !== "published") {
    redirect("/panier?error=variant_unavailable");
  }

  if (variant.stockQuantity < validation.data.quantity) {
    redirect("/panier?error=insufficient_stock");
  }

  try {
    const updated = await updateGuestCartItemQuantity({
      cartId,
      itemId,
      quantity: validation.data.quantity,
    });

    if (!updated) {
      redirect("/panier?error=missing_cart_item");
    }
  } catch (error) {
    console.error(error);
    redirect("/panier?error=save_failed");
  }

  redirect("/panier?status=updated");
}
