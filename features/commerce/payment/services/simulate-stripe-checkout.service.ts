import "server-only";
import { createHash } from "node:crypto";

import type { StripeCheckoutSessionStatus } from "../stripe-checkout-session-state";

/**
 * Contrepartie neutralisée de stripe.checkout.sessions.retrieve / .create :
 * ne produit aucun appel réseau Stripe. Utilisée quand la politique
 * d'exécution résout hors LIVE (cf. core/runtime/resolve-store-execution-policy).
 * Déterministe : aucun aléatoire, aucune horloge. Ne lève jamais d'exception.
 */

type SimulateCheckoutSessionRetrieveInput = { sessionId: string };
type SimulateCheckoutSessionRetrieveResult = {
  status: StripeCheckoutSessionStatus;
  url: string | null;
};

/**
 * Simule toujours une session "expired" : force la branche "replace" déjà
 * gérée par resolveStripeCheckoutSessionState, qui déclenche la création
 * d'une nouvelle session simulée. Aucun état "open"/"complete" n'est
 * fabriqué, car aucune session réelle n'existe côté Stripe pour l'appuyer.
 */
export function simulateStripeCheckoutSessionRetrieve(
  input: SimulateCheckoutSessionRetrieveInput
): Promise<SimulateCheckoutSessionRetrieveResult> {
  void input;
  return Promise.resolve({ status: "expired", url: null });
}

type SimulateCheckoutSessionCreateInput = {
  orderId: string;
  reference: string;
  totalAmountCents: number;
  currencyCode: string;
};
type SimulateCheckoutSessionCreateResult = {
  id: string;
  url: string;
  payment_intent: string | null;
};

/**
 * Redirige vers la page de confirmation existante avec le même paramètre
 * `payment=return` que le success_url réel — aucune nouvelle route, aucun
 * état storefront inventé. La commande ne devient jamais "payée" par ce
 * seul appel : cette transition dépend du webhook Stripe réel
 * (app/api/stripe/webhook/route.ts), hors périmètre de ce lot.
 */
export function simulateStripeCheckoutSessionCreate(
  input: SimulateCheckoutSessionCreateInput
): Promise<SimulateCheckoutSessionCreateResult> {
  const fingerprint = createHash("sha256")
    .update(`${input.orderId}|${input.reference}|${input.totalAmountCents}|${input.currencyCode}`)
    .digest("hex")
    .slice(0, 16);

  return Promise.resolve({
    id: `simulated_cs_${fingerprint}`,
    url: `/checkout/confirmation/${input.reference}?payment=return`,
    payment_intent: `simulated_pi_${fingerprint}`,
  });
}
