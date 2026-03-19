import { prisma } from "@/db/prisma-client";
import type { PaymentStatus, PaymentStartContext } from "./payment.types";
export type { PaymentStatus, PaymentStartContext };

function isValidOrderReference(value: string): boolean {
  return /^CRY-[A-Z0-9]{10}$/.test(value);
}

export async function findPaymentStartContextByOrderReference(
  reference: string
): Promise<PaymentStartContext | null> {
  if (!isValidOrderReference(reference)) {
    return null;
  }

  const row = await prisma.payments.findFirst({
    where: { orders: { reference } },
    select: {
      status: true,
      stripe_checkout_session_id: true,
      stripe_payment_intent_id: true,
      orders: {
        select: {
          id: true,
          reference: true,
          status: true,
          customer_email: true,
          total_amount: true,
        },
      },
    },
  });

  if (row === null) {
    return null;
  }

  return {
    orderId: row.orders.id.toString(),
    reference: row.orders.reference,
    orderStatus: row.orders.status as PaymentStartContext["orderStatus"],
    customerEmail: row.orders.customer_email,
    totalAmount: row.orders.total_amount.toString(),
    paymentStatus: row.status as PaymentStatus,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
  };
}

export async function saveStripeCheckoutSessionForOrder(input: {
  orderId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}): Promise<void> {
  const order = await prisma.orders.findUnique({
    where: { id: BigInt(input.orderId) },
    select: { total_amount: true },
  });

  if (order === null) {
    return;
  }

  await prisma.payments.upsert({
    where: { order_id: BigInt(input.orderId) },
    create: {
      order_id: BigInt(input.orderId),
      provider: "stripe",
      method: "card",
      status: "pending",
      amount: order.total_amount,
      currency: "eur",
      stripe_checkout_session_id: input.stripeCheckoutSessionId,
      stripe_payment_intent_id: input.stripePaymentIntentId,
    },
    update: {
      status: "pending",
      stripe_checkout_session_id: input.stripeCheckoutSessionId,
      stripe_payment_intent_id: input.stripePaymentIntentId,
    },
  });
}

export async function markPaymentSucceededByCheckoutSessionId(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}): Promise<string | null> {
  // Serializable isolation reproduces the SELECT FOR UPDATE semantics of the original SQL:
  // prevents two concurrent webhook calls from both reading status="pending" and both updating.
  return prisma.$transaction(
    async (tx) => {
      const row = await tx.payments.findFirst({
        where: { stripe_checkout_session_id: input.stripeCheckoutSessionId },
        select: {
          id: true,
          order_id: true,
          status: true,
          orders: { select: { status: true } },
        },
      });

      if (row === null) {
        return null;
      }

      if (row.status !== "succeeded") {
        await tx.payments.update({
          where: { id: row.id },
          data: {
            status: "succeeded",
            // coalesce($2, stripe_payment_intent_id): only update if new value provided
            ...(input.stripePaymentIntentId !== null
              ? { stripe_payment_intent_id: input.stripePaymentIntentId }
              : {}),
          },
        });
      }

      if (row.orders.status === "pending") {
        await tx.orders.update({
          where: { id: row.order_id },
          data: { status: "paid" },
        });
      }

      return row.order_id.toString();
    },
    { isolationLevel: "Serializable" }
  );
}

export async function markPaymentFailedByCheckoutSessionId(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}): Promise<void> {
  // Serializable isolation reproduces the SELECT FOR UPDATE semantics of the original SQL.
  await prisma.$transaction(
    async (tx) => {
      const row = await tx.payments.findFirst({
        where: { stripe_checkout_session_id: input.stripeCheckoutSessionId },
        select: {
          id: true,
          status: true,
        },
      });

      if (row === null) {
        return;
      }

      if (row.status !== "succeeded") {
        await tx.payments.update({
          where: { id: row.id },
          data: {
            status: "failed",
            // coalesce($2, stripe_payment_intent_id): only update if new value provided
            ...(input.stripePaymentIntentId !== null
              ? { stripe_payment_intent_id: input.stripePaymentIntentId }
              : {}),
          },
        });
      }
    },
    { isolationLevel: "Serializable" }
  );
}
