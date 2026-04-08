//core/payments/stripe/server.ts
import Stripe from "stripe";
import { serverEnv } from "@/core/config/env";

const env = serverEnv;

declare global {
  var __creatyssStripe__: Stripe | undefined;
}

function createStripeClient(): Stripe {
  return new Stripe(serverEnv.stripeSecretKey);
}

export const stripe = globalThis.__creatyssStripe__ ?? createStripeClient();

if (env.nodeEnv !== "production") {
  globalThis.__creatyssStripe__ = stripe;
}
