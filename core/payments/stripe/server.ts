//core/payments/stripe/server.ts
import Stripe from "stripe";
import { serverEnv } from "@/core/config/env";

const env = serverEnv;

declare global {
  var __creatyssStripe__: Stripe | undefined;
}

function createStripeClient(): Stripe {
  // stripeSecretKey est null quand Stripe n'est pas configuré.
  // Dans ce cas on instancie avec une clé invalide : le client ne sera
  // jamais appelé car la méthode "card" ne sera pas proposée au checkout.
  const key = serverEnv.stripeSecretKey ?? "sk_not_configured";
  return new Stripe(key);
}

export const stripe = globalThis.__creatyssStripe__ ?? createStripeClient();

if (env.nodeEnv !== "production") {
  globalThis.__creatyssStripe__ = stripe;
}
