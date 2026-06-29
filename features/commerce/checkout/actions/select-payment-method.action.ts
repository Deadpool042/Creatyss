"use server";

import { readCartSessionToken } from "@/core/sessions/cart";
import { writeCheckoutPaymentMethod } from "@/core/sessions/checkout-payment";
import { readGuestCheckoutContextByToken } from "@/features/commerce/cart/lib/guest-cart.repository";
import { getAvailablePaymentMethods } from "@/features/commerce/checkout/queries/get-available-payment-methods.query";
import { getStoreIdByCartId } from "@/features/commerce/checkout/queries/get-store-id-by-cart.query";
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

  // --- 4. Vérifier que la méthode soumise est activée dans les settings du store
  const storeId =
    checkoutContext.cart !== null ? await getStoreIdByCartId(checkoutContext.cart.id) : null;

  if (storeId !== null) {
    const availableMethods = await getAvailablePaymentMethods({ storeId });
    const isMethodAvailable = availableMethods.some((m) => m.id === paymentMethodCode);

    if (!isMethodAvailable) {
      return { status: "error", message: "Ce mode de paiement n'est pas disponible." };
    }
  }

  // --- 6. Persister la sélection dans le cookie de session
  await writeCheckoutPaymentMethod(paymentMethodCode);

  return { status: "success", message: "Mode de paiement sélectionné." };
}
