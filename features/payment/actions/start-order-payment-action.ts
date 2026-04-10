"use server";

import { redirect } from "next/navigation";
import {
  findPaymentStartContextByOrderReference,
  markPaymentFailedByCheckoutSessionId,
  saveStripeCheckoutSessionForOrder,
} from "@/features/payment/lib/payment.repository";
import { serverEnv } from "@/core/config/env";
import { stripe } from "@/core/payments/stripe/server";
import { resolveStripeCheckoutSessionState } from "@/features/payment/stripe-checkout-session-state";

function moneyStringToCents(value: string): number {
  const match = value.match(/^(\d+)(?:\.(\d{1,2}))?$/);

  if (!match) {
    return 0;
  }

  const [, major, minor = ""] = match;
  const normalizedMinor = minor.padEnd(2, "0");

  return Number.parseInt(major ?? "0", 10) * 100 + Number.parseInt(normalizedMinor, 10);
}

export async function startOrderPaymentAction(formData: FormData): Promise<void> {
  const referenceValue = formData.get("reference");
  const reference = typeof referenceValue === "string" ? referenceValue.trim() : "";

  if (reference.length === 0) {
    redirect("/checkout?error=payment_unavailable");
  }

  const paymentContext = await findPaymentStartContextByOrderReference(reference);

  if (paymentContext === null) {
    redirect(`/checkout/confirmation/${reference}?payment=unavailable`);
  }

  if (
    paymentContext.orderStatus === "paid" ||
    paymentContext.orderStatus === "preparing" ||
    paymentContext.orderStatus === "shipped" ||
    paymentContext.paymentStatus === "succeeded"
  ) {
    redirect(`/checkout/confirmation/${reference}?payment=already_paid`);
  }

  if (paymentContext.orderStatus === "cancelled") {
    redirect(`/checkout/confirmation/${reference}?payment=unavailable`);
  }

  let redirectTarget: string | null = null;

  try {
    if (
      paymentContext.paymentStatus === "pending" &&
      paymentContext.stripeCheckoutSessionId !== null
    ) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        paymentContext.stripeCheckoutSessionId
      );
      const existingSessionState = resolveStripeCheckoutSessionState({
        status: existingSession.status,
        url: existingSession.url ?? null,
      });

      switch (existingSessionState.kind) {
        case "reuse":
          redirectTarget = existingSessionState.url;
          break;
        case "await_confirmation":
          redirectTarget = `/checkout/confirmation/${reference}?payment=return`;
          break;
        case "replace":
          await markPaymentFailedByCheckoutSessionId({
            stripeCheckoutSessionId: paymentContext.stripeCheckoutSessionId,
            stripePaymentIntentId: paymentContext.stripePaymentIntentId,
          });
          break;
        case "unavailable":
          redirectTarget = `/checkout/confirmation/${reference}?payment=failed`;
          break;
      }
    }

    if (redirectTarget !== null) {
      redirect(redirectTarget);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      ...(paymentContext.customerEmail !== null
        ? { customer_email: paymentContext.customerEmail }
        : {}),
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: moneyStringToCents(paymentContext.totalAmount),
            product_data: {
              name: `Commande ${paymentContext.reference}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId: paymentContext.orderId,
        orderReference: paymentContext.reference,
      },
      success_url: `${serverEnv.appUrl}/checkout/confirmation/${paymentContext.reference}?payment=return`,
      cancel_url: `${serverEnv.appUrl}/checkout/confirmation/${paymentContext.reference}?payment=cancelled`,
    });

    if (!session.url) {
      throw new Error("Stripe Checkout session returned no URL.");
    }

    await saveStripeCheckoutSessionForOrder({
      orderId: paymentContext.orderId,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    });

    redirectTarget = session.url;
  } catch (error) {
    console.error(error);
    redirect(`/checkout/confirmation/${reference}?payment=failed`);
  }

  if (redirectTarget === null) {
    redirect(`/checkout/confirmation/${reference}?payment=failed`);
  }

  redirect(redirectTarget);
}
