"use server";

import { readCartSessionToken } from "@/core/sessions/cart";
import { writeCheckoutPaymentMethod } from "@/core/sessions/checkout-payment";
import { readGuestCheckoutContextByToken } from "@/features/commerce/cart/lib/guest-cart.repository";
import { isCheckoutPaymentMethod } from "@/features/commerce/checkout/types/checkout-payment-method.types";

type SelectPaymentMethodResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function selectPaymentMethodAction(
  formData: FormData
): Promise<SelectPaymentMethodResult> {
  // --- 1. Lire cartToken depuis la session (jamais depuis FormData)
  const cartToken = await readCartSessionToken();

  if (cartToken === null) {
    return { status: "error", message: "Session introuvable." };
  }

  // --- 2. Valider paymentMethodCode depuis FormData
  const rawCode = formData.get("paymentMethodCode");
  if (typeof rawCode !== "string" || rawCode.trim().length === 0) {
    return { status: "error", message: "Mode de paiement non spécifié." };
  }

  const paymentMethodCode = rawCode.trim();

  if (!isCheckoutPaymentMethod(paymentMethodCode)) {
    return { status: "error", message: "Mode de paiement invalide." };
  }

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

  // --- 4. Le checkout doit exister pour y associer le mode de paiement
  if (checkoutContext.draft === null) {
    return {
      status: "error",
      message: "Veuillez d'abord renseigner vos coordonnées de livraison.",
    };
  }

  // --- 5. Persister la sélection dans le cookie de session
  await writeCheckoutPaymentMethod(paymentMethodCode);

  return { status: "success", message: "Mode de paiement sélectionné." };
}
