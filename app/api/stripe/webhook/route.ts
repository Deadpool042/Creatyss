import type Stripe from "stripe";
import {
  markPaymentFailedByCheckoutSessionId,
  markPaymentSucceededByCheckoutSessionId
} from "@/db/repositories/payment.repository";
import { getStripeWebhookSecret } from "@/lib/env";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

function extractStripePaymentIntentId(
  session: Stripe.Checkout.Session
): string | null {
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : null;
}

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature.", { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      getStripeWebhookSecret()
    );
  } catch (error) {
    console.error(error);
    return new Response("Invalid Stripe webhook signature.", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        await markPaymentSucceededByCheckoutSessionId({
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: extractStripePaymentIntentId(session)
        });
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        await markPaymentFailedByCheckoutSessionId({
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: extractStripePaymentIntentId(session)
        });
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error(error);
    return new Response("Webhook handling failed.", { status: 500 });
  }

  return Response.json({ received: true });
}
