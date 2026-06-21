//core/config/env/stripe.ts
import "server-only";

/**
 * Vérifie si Stripe est opérationnellement configuré sans throw.
 * Lit process.env directement pour rester indépendant du parse Zod strict.
 * À utiliser pour conditionner la disponibilité des features Stripe.
 */
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const invalidValues = ["", "sk_test_change_me", "whsec_change_me"];
  return (
    typeof key === "string" &&
    !invalidValues.includes(key) &&
    typeof secret === "string" &&
    !invalidValues.includes(secret)
  );
}
