import "server-only";
import { createHash } from "node:crypto";

/**
 * Contrepartie neutralisée de stripe.refunds.create : ne produit aucun
 * appel réseau Stripe. Utilisée quand la politique d'exécution résout hors
 * LIVE (cf. core/runtime/resolve-store-execution-policy). Déterministe :
 * aucun aléatoire, aucune horloge. Ne lève jamais d'exception.
 */

type SimulateStripeRefundInput = {
  paymentIntentId: string;
  amountCents: number;
};
type SimulateStripeRefundResult = { id: string };

export function simulateStripeRefund(
  input: SimulateStripeRefundInput
): Promise<SimulateStripeRefundResult> {
  const fingerprint = createHash("sha256")
    .update(`${input.paymentIntentId}|${input.amountCents}`)
    .digest("hex")
    .slice(0, 16);

  return Promise.resolve({ id: `simulated_re_${fingerprint}` });
}
