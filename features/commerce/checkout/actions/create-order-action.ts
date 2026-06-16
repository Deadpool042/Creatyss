"use server";

import { redirect } from "next/navigation";
import { clearCartSessionToken, readCartSessionToken } from "@/core/sessions/cart";
import { clearCheckoutPaymentMethod, readCheckoutPaymentMethod } from "@/core/sessions/checkout-payment";
import { createOrderFromGuestCartToken } from "@/features/commerce/orders/lib/order.repository";
import { OrderRepositoryError } from "@/features/commerce/orders/lib/order.types";
import {
  readGuestCheckoutContextByToken,
  upsertGuestCheckoutDetails,
} from "@/features/commerce/cart/lib/guest-cart.repository";
import { validateGuestCheckoutInput } from "@/entities/checkout/guest-checkout-input";
import { sendOrderTransactionalEmail } from "@/features/email";
import { getAvailablePaymentMethods } from "@/features/commerce/checkout/queries/get-available-payment-methods.query";
import { getStoreIdByCartId } from "@/features/commerce/checkout/queries/get-store-id-by-cart.query";
import { normalizeDiscountCode } from "@/features/commerce/discounts/lib/resolve-order-discount";

function buildCheckoutRedirectHref(input: {
  error: string;
  discountCode?: string | null;
}): string {
  const params = new URLSearchParams();
  params.set("error", input.error);

  const normalizedDiscountCode =
    typeof input.discountCode === "string" ? normalizeDiscountCode(input.discountCode) : "";

  if (normalizedDiscountCode.length > 0) {
    params.set("discount", normalizedDiscountCode);
  }

  return `/checkout?${params.toString()}`;
}

export async function createOrderAction(formData: FormData): Promise<void> {
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

  // Re-read the checkout context after upsert to get the persisted shipping selection.
  // Done outside the order-creation try/catch so a missing_shipping_selection redirect
  // is not swallowed by the generic create_failed handler.
  const refreshedContext = await readGuestCheckoutContextByToken(cartToken);

  if (!refreshedContext?.draft?.shippingSelection) {
    redirect(buildCheckoutRedirectHref({ error: "missing_shipping_selection", discountCode }));
  }

  const selectedPaymentMethod = await readCheckoutPaymentMethod();

  if (selectedPaymentMethod === null) {
    redirect(buildCheckoutRedirectHref({ error: "missing_payment_method", discountCode }));
  }

  // Re-validate the selected payment method against the current store settings.
  // Guards against race condition: admin disables a payment method after client selection.
  const storeId = await getStoreIdByCartId(cart.id);

  if (storeId !== null) {
    const availableMethods = await getAvailablePaymentMethods({ storeId });
    const isMethodStillAvailable = availableMethods.some((m) => m.id === selectedPaymentMethod);

    if (!isMethodStillAvailable) {
      await clearCheckoutPaymentMethod();
      redirect(buildCheckoutRedirectHref({ error: "payment_method_unavailable", discountCode }));
    }
  }

  let orderReference: string;

  try {
    const order = await createOrderFromGuestCartToken(
      cartToken,
      selectedPaymentMethod,
      discountCode
    );
    orderReference = order.reference;

    try {
      await sendOrderTransactionalEmail({
        orderId: order.id,
        eventType: "order_created",
      });
    } catch (emailError) {
      console.error("[checkout-email]", emailError);
    }

    await clearCartSessionToken();
    await clearCheckoutPaymentMethod();
  } catch (error) {
    if (error instanceof OrderRepositoryError) {
      redirect(buildCheckoutRedirectHref({ error: error.code, discountCode }));
    }

    console.error(error);
    redirect(buildCheckoutRedirectHref({ error: "create_failed", discountCode }));
  }

  redirect(`/checkout/confirmation/${orderReference}`);
}
