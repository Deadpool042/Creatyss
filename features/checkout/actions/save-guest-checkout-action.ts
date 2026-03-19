"use server";

import { redirect } from "next/navigation";
import {
  readGuestCheckoutContextByToken,
  upsertGuestCheckoutDetails,
} from "@/db/repositories/guest-cart.repository";
import { validateGuestCheckoutInput } from "@/entities/checkout/guest-checkout-input";
import { readCartSessionToken } from "@/lib/cart-session";

export async function saveGuestCheckoutAction(formData: FormData): Promise<void> {
  const cartToken = await readCartSessionToken();

  if (cartToken === null) {
    redirect("/checkout?error=missing_cart");
  }

  const checkoutContext = await readGuestCheckoutContextByToken(cartToken);

  if (checkoutContext === null) {
    redirect("/checkout?error=missing_cart");
  }

  if (checkoutContext.issues.includes("empty_cart")) {
    redirect("/checkout?error=empty_cart");
  }

  if (checkoutContext.issues.includes("cart_unavailable")) {
    redirect("/checkout?error=cart_unavailable");
  }

  const cart = checkoutContext.cart;

  if (cart === null) {
    redirect("/checkout?error=empty_cart");
  }

  const validation = validateGuestCheckoutInput({
    customerEmail: formData.get("customerEmail"),
    customerFirstName: formData.get("customerFirstName"),
    customerLastName: formData.get("customerLastName"),
    customerPhone: formData.get("customerPhone"),
    shippingAddressLine1: formData.get("shippingAddressLine1"),
    shippingAddressLine2: formData.get("shippingAddressLine2"),
    shippingPostalCode: formData.get("shippingPostalCode"),
    shippingCity: formData.get("shippingCity"),
    billingSameAsShipping: formData.get("billingSameAsShipping"),
    billingFirstName: formData.get("billingFirstName"),
    billingLastName: formData.get("billingLastName"),
    billingPhone: formData.get("billingPhone"),
    billingAddressLine1: formData.get("billingAddressLine1"),
    billingAddressLine2: formData.get("billingAddressLine2"),
    billingPostalCode: formData.get("billingPostalCode"),
    billingCity: formData.get("billingCity"),
  });

  if (!validation.ok) {
    redirect(`/checkout?error=${validation.code}`);
  }

  try {
    await upsertGuestCheckoutDetails({
      cartId: cart.id,
      ...validation.data,
    });
  } catch (error) {
    console.error(error);
    redirect("/checkout?error=save_failed");
  }

  redirect("/checkout?status=saved");
}
