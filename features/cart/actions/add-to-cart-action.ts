"use server";

import { redirect } from "next/navigation";
import {
  createCartToken,
  readCartSessionToken,
  setCartSessionToken,
} from "@/core/sessions/cart";
import {
  addGuestCartItemQuantity,
  createGuestCart,
  findGuestCartIdByToken,
  findGuestCartItemByVariant,
  findGuestCartVariantById,
} from "@/features/cart/lib/guest-cart.repository";
import { validateCartItemInput } from "@/entities/cart/cart-item-input";

function normalizeProductSlug(
  value: FormDataEntryValue | string | null | undefined
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

export async function addToCartAction(formData: FormData): Promise<void> {
  const productSlug = normalizeProductSlug(formData.get("productSlug"));

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

  if (variant.productStatus !== "published" || variant.status !== "published") {
    redirect(`/boutique/${productSlug}?cart_error=variant_unavailable`);
  }

  let cartToken = await readCartSessionToken();
  let cartId = cartToken ? await findGuestCartIdByToken(cartToken) : null;

  if (cartId === null) {
    cartToken = createCartToken();
    cartId = await createGuestCart(cartToken);
    await setCartSessionToken(cartToken);
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
      quantity: validation.data.quantity,
    });
  } catch (error) {
    console.error(error);
    redirect(`/boutique/${productSlug}?cart_error=save_failed`);
  }

  redirect(`/boutique/${productSlug}?cart_status=added`);
}
