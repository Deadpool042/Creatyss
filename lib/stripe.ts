import Stripe from "stripe";
import { env, getStripeSecretKey } from "./env";

declare global {
  var __creatyssStripe__: Stripe | undefined;
}

function createStripeClient(): Stripe {
  return new Stripe(getStripeSecretKey());
}

export const stripe = globalThis.__creatyssStripe__ ?? createStripeClient();

if (env.nodeEnv !== "production") {
  globalThis.__creatyssStripe__ = stripe;
}
