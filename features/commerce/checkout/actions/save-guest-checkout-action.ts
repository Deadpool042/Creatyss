"use server";

import { redirect } from "next/navigation";
import { readCartSessionToken } from "@/core/sessions/cart";
import {
  readGuestCheckoutContextByToken,
  upsertGuestCheckoutDetails,
} from "@/features/commerce/cart/lib/guest-cart.repository";
import { validateGuestCheckoutInput } from "@/entities/checkout/guest-checkout-input";
import { normalizeDiscountCode } from "@/features/commerce/discounts/lib/resolve-order-discount";

function buildCheckoutRedirectHref(input: {
  error?: string;
  status?: string;
  discountCode?: string | null;
}): string {
  const params = new URLSearchParams();

  if (input.error) {
    params.set("error", input.error);
  }

  if (input.status) {
    params.set("status", input.status);
  }

  const normalizedDiscountCode =
    typeof input.discountCode === "string" ? normalizeDiscountCode(input.discountCode) : "";

  if (normalizedDiscountCode.length > 0) {
    params.set("discount", normalizedDiscountCode);
  }

  const query = params.toString();
  return query.length > 0 ? `/checkout?${query}` : "/checkout";
}

export async function saveGuestCheckoutAction(formData: FormData): Promise<void> {
  const discountCode =
    typeof formData.get("discountCode") === "string"
      ? formData.get("discountCode")?.toString() ?? ""
      : "";
  const cartToken = await readCartSessionToken();

  if (cartToken === null) {
    redirect(buildCheckoutRedirectHref({ error: "missing_cart", discountCode }));
  }

  const checkoutContext = await readGuestCheckoutContextByToken(cartToken);

  if (checkoutContext === null) {
    redirect(buildCheckoutRedirectHref({ error: "missing_cart", discountCode }));
  }

  if (checkoutContext.issues.includes("empty_cart")) {
    redirect(buildCheckoutRedirectHref({ error: "empty_cart", discountCode }));
  }

  if (checkoutContext.issues.includes("cart_unavailable")) {
    redirect(buildCheckoutRedirectHref({ error: "cart_unavailable", discountCode }));
  }

  const cart = checkoutContext.cart;

  if (cart === null) {
    redirect(buildCheckoutRedirectHref({ error: "empty_cart", discountCode }));
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
    redirect(buildCheckoutRedirectHref({ error: validation.code, discountCode }));
  }

  try {
    await upsertGuestCheckoutDetails({
      cartId: cart.id,
      ...validation.data,
    });
  } catch (error) {
    console.error(error);
    redirect(buildCheckoutRedirectHref({ error: "save_failed", discountCode }));
  }

  redirect(buildCheckoutRedirectHref({ status: "saved", discountCode }));
}
