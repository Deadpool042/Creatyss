"use server";

import { redirect } from "next/navigation";
import { clearCartSessionToken, readCartSessionToken } from "@/core/sessions/cart";
import {
  clearCheckoutPaymentMethod,
  readCheckoutPaymentMethod,
} from "@/core/sessions/checkout-payment";
import {
  clearCheckoutShippingCode,
  readCheckoutShippingCode,
} from "@/core/sessions/checkout-shipping";
import { readLocalePreferenceCookie } from "@/core/sessions/locale-preference";
import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import { createOrderFromGuestCartToken } from "@/features/commerce/orders/lib/order.repository";
import { OrderRepositoryError } from "@/features/commerce/orders/lib/order.types";
import {
  readGuestCheckoutContextByToken,
  upsertCheckoutShippingSelection,
  upsertGuestCheckoutDetails,
} from "@/features/commerce/cart/lib/guest-cart.repository";
import { validateGuestCheckoutInput } from "@/entities/checkout/guest-checkout-input";
import { sendOrderTransactionalEmail } from "@/features/email";
import { getAvailablePaymentMethods } from "@/features/commerce/checkout/queries/get-available-payment-methods.query";
import { getStoreIdByCartId } from "@/features/commerce/checkout/queries/get-store-id-by-cart.query";
import { normalizeDiscountCode } from "@/features/commerce/discounts/lib/resolve-order-discount";
import { db } from "@/core/db";
import type { CurrencyCode } from "@/prisma-generated/client";

/**
 * Résout le code de locale visiteur à persister sur `Order.localeCode`
 * (Horizon 4 — lot multilingue généralisé, cf.
 * docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md).
 *
 * Même pattern de résolution que `getLocalizedHomepageCopy` (cookie +
 * fallback locale par défaut), mais retourne toujours le code résolu — pas
 * seulement en cas d'écart avec la locale par défaut — puisqu'il s'agit ici
 * de persister la locale de la commande, pas de calculer un override
 * d'affichage.
 *
 * Retourne `null` si `platform.localization` n'atteint pas le niveau
 * `multilingual`, ou si le store n'a pas au moins deux locales `ACTIVE` : le
 * champ est nullable et la résolution `order.localeCode ?? store.defaultLocaleCode`
 * se fait à la lecture.
 */
async function resolveCheckoutLocaleCode(storeId: string | null): Promise<string | null> {
  if (storeId === null) {
    return null;
  }

  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual", { storeId });

  if (!allowed) {
    return null;
  }

  const store = await db.store.findUnique({
    where: { id: storeId },
    select: { defaultLocaleCode: true },
  });

  const locales = await db.localizationLocale.findMany({
    where: { storeId, archivedAt: null, status: "ACTIVE" },
    select: { code: true, isDefault: true },
  });

  if (locales.length < 2) {
    return null;
  }

  const defaultLocale =
    locales.find((locale) => locale.code === store?.defaultLocaleCode) ??
    locales.find((locale) => locale.isDefault) ??
    null;

  if (defaultLocale === null) {
    return null;
  }

  const cookieLocaleCode = await readLocalePreferenceCookie();

  return resolvePreferredLocaleCode({
    availableLocaleCodes: locales.map((locale) => locale.code),
    defaultLocaleCode: defaultLocale.code,
    cookieLocaleCode,
  });
}

function buildCheckoutRedirectHref(input: { error: string; discountCode?: string | null }): string {
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
      ? (formData.get("discountCode")?.toString() ?? "")
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

  // Re-read the checkout context after upsert to get the draft id and persisted shipping selection.
  // Done outside the order-creation try/catch so a missing_shipping_selection redirect
  // is not swallowed by the generic create_failed handler.
  const refreshedContext = await readGuestCheckoutContextByToken(cartToken);
  const refreshedDraft = refreshedContext?.draft ?? null;

  if (refreshedDraft === null) {
    redirect(buildCheckoutRedirectHref({ error: "missing_shipping_selection", discountCode }));
  }

  if (refreshedDraft.shippingSelection === null) {
    // Reconcile: the user may have selected a shipping method before the draft existed.
    // If a valid code is stored in session, persist it to the draft now.
    const sessionCode = await readCheckoutShippingCode();

    if (sessionCode === null) {
      redirect(buildCheckoutRedirectHref({ error: "missing_shipping_selection", discountCode }));
    }

    const cartRecord = await db.cart.findUnique({
      where: { id: cart.id },
      select: { storeId: true },
    });

    if (cartRecord === null) {
      redirect(buildCheckoutRedirectHref({ error: "missing_shipping_selection", discountCode }));
    }

    const shippingMethod = await db.shippingMethod.findFirst({
      where: { storeId: cartRecord.storeId, code: sessionCode, status: "ACTIVE" },
      select: { id: true, code: true, name: true, amount: true, currencyCode: true },
    });

    if (shippingMethod === null) {
      redirect(buildCheckoutRedirectHref({ error: "missing_shipping_selection", discountCode }));
    }

    await upsertCheckoutShippingSelection({
      checkoutId: refreshedDraft.id,
      shippingMethodId: shippingMethod.id,
      methodCode: shippingMethod.code,
      methodName: shippingMethod.name,
      amountCents: Math.round(Number(shippingMethod.amount) * 100),
      currencyCode: shippingMethod.currencyCode as CurrencyCode,
    });
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
    const localeCode = await resolveCheckoutLocaleCode(storeId);
    const order = await createOrderFromGuestCartToken(
      cartToken,
      selectedPaymentMethod,
      discountCode,
      localeCode
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
    await clearCheckoutShippingCode();
  } catch (error) {
    if (error instanceof OrderRepositoryError) {
      redirect(buildCheckoutRedirectHref({ error: error.code, discountCode }));
    }

    console.error(error);
    redirect(buildCheckoutRedirectHref({ error: "create_failed", discountCode }));
  }

  redirect(`/checkout/confirmation/${orderReference}`);
}
