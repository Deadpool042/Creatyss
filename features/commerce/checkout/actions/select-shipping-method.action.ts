"use server";

import { db } from "@/core/db";
import { moneyStringToCents } from "@/core/money";
import { readCartSessionToken } from "@/core/sessions/cart";
import { writeCheckoutShippingCode } from "@/core/sessions/checkout-shipping";
import {
  readGuestCheckoutContextByToken,
  upsertCheckoutShippingSelection,
} from "@/features/commerce/cart/lib/guest-cart.repository";
import type { CurrencyCode } from "@/prisma-generated/client";

type SelectShippingMethodResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function selectShippingMethodAction(
  formData: FormData
): Promise<SelectShippingMethodResult> {
  // --- 1. Lire cartToken depuis la session (jamais depuis FormData)
  const cartToken = await readCartSessionToken();

  if (cartToken === null) {
    return { status: "error", message: "Session introuvable." };
  }

  // --- 2. Valider shippingMethodCode depuis FormData
  const rawCode = formData.get("shippingMethodCode");
  if (typeof rawCode !== "string" || rawCode.trim().length === 0) {
    return { status: "error", message: "Méthode de livraison non spécifiée." };
  }
  const shippingMethodCode = rawCode.trim();

  // --- 3. Charger le contexte checkout
  const checkoutContext = await readGuestCheckoutContextByToken(cartToken);

  if (checkoutContext === null) {
    return { status: "error", message: "Panier introuvable." };
  }

  if (checkoutContext.issues.includes("empty_cart")) {
    return { status: "error", message: "Votre panier est vide." };
  }

  if (checkoutContext.issues.includes("cart_unavailable")) {
    return { status: "error", message: "Un article de votre panier n'est plus disponible." };
  }

  const cart = checkoutContext.cart;

  if (cart === null) {
    return { status: "error", message: "Panier introuvable." };
  }

  const draft = checkoutContext.draft;
  const checkoutId = draft?.id ?? null;

  // --- 5. Recalculer le subtotal depuis la DB (jamais depuis FormData)
  const subtotalCents = cart.lines.reduce(
    (sum, line) => sum + moneyStringToCents(line.lineTotalAmount),
    0
  );

  // --- 6. Récupérer le storeId depuis le cart en DB
  const cartRecord = await db.cart.findUnique({
    where: { id: cart.id },
    select: { storeId: true },
  });

  if (cartRecord === null) {
    return { status: "error", message: "Panier introuvable." };
  }

  const { storeId } = cartRecord;

  // --- 7. Charger la ShippingMethod depuis la DB par (storeId, code)
  const shippingMethod = await db.shippingMethod.findFirst({
    where: { storeId, code: shippingMethodCode },
    select: {
      id: true,
      code: true,
      name: true,
      amount: true,
      currencyCode: true,
      status: true,
      minSubtotalAmount: true,
      maxSubtotalAmount: true,
    },
  });

  if (shippingMethod === null) {
    return { status: "error", message: "Méthode de livraison introuvable." };
  }

  // --- 8. Vérifier que la méthode est active
  if (shippingMethod.status !== "ACTIVE") {
    return {
      status: "error",
      message: "Cette méthode de livraison n'est plus disponible.",
    };
  }

  // --- 9. Vérifier les seuils de subtotal
  if (
    shippingMethod.minSubtotalAmount !== null &&
    subtotalCents < Math.round(Number(shippingMethod.minSubtotalAmount) * 100)
  ) {
    return {
      status: "error",
      message: "Votre panier ne remplit pas les conditions pour cette méthode.",
    };
  }

  if (
    shippingMethod.maxSubtotalAmount !== null &&
    subtotalCents > Math.round(Number(shippingMethod.maxSubtotalAmount) * 100)
  ) {
    return {
      status: "error",
      message: "Votre panier ne remplit pas les conditions pour cette méthode.",
    };
  }

  // --- 10. Persister la sélection — en DB si le draft existe, en session sinon
  if (checkoutId !== null) {
    await upsertCheckoutShippingSelection({
      checkoutId,
      shippingMethodId: shippingMethod.id,
      methodCode: shippingMethod.code,
      methodName: shippingMethod.name,
      amountCents: Math.round(Number(shippingMethod.amount) * 100),
      currencyCode: shippingMethod.currencyCode as CurrencyCode,
    });
  } else {
    await writeCheckoutShippingCode(shippingMethod.code);
  }

  return { status: "success", message: "Méthode de livraison sélectionnée." };
}
