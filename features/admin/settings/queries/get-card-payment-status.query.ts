import "server-only";

import { isStripeConfigured } from "@/core/config/env/stripe";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export type CardPaymentStatus = Readonly<{
  /** Niveau de gouvernance "En ligne" atteint sur commerce.payments pour la boutique courante. */
  governanceLevelReached: boolean;
  /** Clés Stripe présentes et non-placeholder côté serveur (variables d'environnement). */
  stripeConfigured: boolean;
  /** true seulement si les deux conditions sont réunies — reflète get-available-payment-methods.query.ts. */
  isActive: boolean;
}>;

export async function getCardPaymentStatus(): Promise<CardPaymentStatus> {
  const storeId = await getCurrentStoreId();
  const governanceLevelReached =
    storeId !== null ? await meetsFeatureLevel("commerce.payments", "online", { storeId }) : false;
  const stripeConfigured = isStripeConfigured();

  return {
    governanceLevelReached,
    stripeConfigured,
    isActive: governanceLevelReached && stripeConfigured,
  };
}
