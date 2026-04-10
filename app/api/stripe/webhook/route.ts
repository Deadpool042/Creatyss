import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  findPaymentByCheckoutSessionId,
  markPaymentFailedByCheckoutSessionId,
  markPaymentSucceededByCheckoutSessionId,
} from "@/features/payment/lib/payment.repository";
import { serverEnv } from "@/core/config/env";
import { stripe } from "@/core/payments/stripe/server";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, serverEnv.stripeWebhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (typeof session.id === "string") {
      await markPaymentSucceededByCheckoutSessionId({
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
      });
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (typeof session.id === "string") {
      await markPaymentFailedByCheckoutSessionId({
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : null,
      });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    if (typeof paymentIntent.id === "string") {
      const payment = await findPaymentByCheckoutSessionId({
        stripeCheckoutSessionId: paymentIntent.id,
        stripePaymentIntentId: paymentIntent.id,
      });

      if (payment?.providerReference) {
        await markPaymentFailedByCheckoutSessionId({
          stripeCheckoutSessionId: payment.providerReference,
          stripePaymentIntentId: paymentIntent.id,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
