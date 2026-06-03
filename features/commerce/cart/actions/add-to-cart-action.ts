"use server";

import { redirect } from "next/navigation";
import {
  readCartSessionToken,
  setCartSessionToken,
} from "@/core/sessions/cart";
import {
  addGuestCartItemQuantity,
  createGuestCart,
  findGuestCartIdByToken,
  findGuestCartItemByVariant,
  findGuestCartVariantById,
} from "@/features/commerce/cart/lib/guest-cart.repository";
import { validateCartItemInput } from "@/entities/cart/cart-item-input";

type AddToCartIntent = "add_to_cart" | "buy_now";

function normalizeProductSlug(
  value: FormDataEntryValue | string | null | undefined
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeAddToCartIntent(value: FormDataEntryValue | null): AddToCartIntent {
  if (value === "buy_now") {
    return "buy_now";
  }

  return "add_to_cart";
}

export async function addToCartAction(formData: FormData): Promise<void> {
  const productSlug = normalizeProductSlug(formData.get("productSlug"));
  const intent = normalizeAddToCartIntent(formData.get("intent"));

  if (productSlug === null) {
    redirect("/boutique");
  }

  const validation = validateCartItemInput({
    variantId: formData.get("variantId"),
    quantity: formData.get("quantity"),
  });

  if (!validation.ok) {
    redirect(`/boutique/${productSlug}?cart_error=${validation.code}`);
  }

  const variant = await findGuestCartVariantById(validation.data.variantId);

  if (variant === null) {
    redirect(`/boutique/${productSlug}?cart_error=missing_variant`);
  }

  if (variant.productSlug !== productSlug) {
    redirect(`/boutique/${productSlug}?cart_error=missing_variant`);
  }

  if (variant.productStatus !== "ACTIVE" || variant.status !== "ACTIVE") {
    redirect(`/boutique/${productSlug}?cart_error=variant_unavailable`);
  }

  const cartToken = await readCartSessionToken();
  let cartId = cartToken ? await findGuestCartIdByToken(cartToken) : null;

  if (cartId === null) {
    cartId = await createGuestCart();
    await setCartSessionToken(cartId);
  }

  const existingItem = await findGuestCartItemByVariant(cartId, variant.id);
  const targetQuantity = (existingItem?.quantity ?? 0) + validation.data.quantity;

  if (variant.stockQuantity < targetQuantity) {
    redirect(`/boutique/${productSlug}?cart_error=insufficient_stock`);
  }

  try {
    await addGuestCartItemQuantity({
      cartId,
      variantId: variant.id,
      productId: variant.productId,
      productName: variant.productName,
      variantName: variant.name,
      sku: variant.sku,
      unitPriceAmount: variant.unitPriceAmount,
      quantity: validation.data.quantity,
    });
  } catch (error) {
    console.error(error);
    redirect(`/boutique/${productSlug}?cart_error=save_failed`);
  }

  if (intent === "buy_now") {
    redirect("/panier?status=buy_now_added");
  }

  redirect(`/boutique/${productSlug}?cart_status=added`);
}
