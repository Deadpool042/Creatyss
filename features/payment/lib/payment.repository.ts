import { db } from "@/core/db";

export type PaymentStartContext = {
  orderId: string;
  reference: string;
  totalAmount: string;
  currencyCode: string;
  customerEmail: string | null;
  orderStatus: string;
  paymentStatus: string | null;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
};

const STRIPE_PROVIDER = "stripe";

export async function findPaymentByCheckoutSessionId(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
}) {
  return db.payment.findFirst({
    where: {
      provider: STRIPE_PROVIDER,
      providerReference: input.stripeCheckoutSessionId,
    },
  });
}

export async function markPaymentFailedByCheckoutSessionId(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
}): Promise<null> {
  await db.payment.updateMany({
    where: {
      provider: STRIPE_PROVIDER,
      providerReference: input.stripeCheckoutSessionId,
    },
    data: {
      status: "FAILED",
      ...(input.stripePaymentIntentId !== undefined
        ? { providerPaymentId: input.stripePaymentIntentId }
        : {}),
      failedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return null;
}

export async function markPaymentSucceededByCheckoutSessionId(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string | null;
}): Promise<string | null> {
  const payment = await db.payment.findFirst({
    where: {
      provider: STRIPE_PROVIDER,
      providerReference: input.stripeCheckoutSessionId,
    },
    select: {
      id: true,
      orderId: true,
    },
  });

  if (payment === null) {
    return null;
  }

  await db.payment.update({
    where: {
      id: payment.id,
    },
    data: {
      status: "CAPTURED",
      ...(input.stripePaymentIntentId !== undefined
        ? { providerPaymentId: input.stripePaymentIntentId }
        : {}),
      capturedAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return payment.orderId;
}

export async function findPaymentStartContextByOrderReference(
  orderReference: string
): Promise<PaymentStartContext | null> {
  const order = await db.order.findFirst({
    where: {
      orderNumber: orderReference,
    },
    select: {
      id: true,
      orderNumber: true,
      totalAmount: true,
      currencyCode: true,
      customerEmail: true,
      status: true,
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
        select: {
          status: true,
          provider: true,
          providerReference: true,
          providerPaymentId: true,
        },
      },
    },
  });

  if (order === null) {
    return null;
  }

  const latestStripePayment =
    order.payments.find((payment) => payment.provider === STRIPE_PROVIDER) ?? null;

  return {
    orderId: order.id,
    reference: order.orderNumber,
    totalAmount: order.totalAmount.toString(),
    currencyCode: order.currencyCode,
    customerEmail: order.customerEmail,
    orderStatus: order.status.toLowerCase(),
    paymentStatus: latestStripePayment?.status.toLowerCase() ?? null,
    stripeCheckoutSessionId: latestStripePayment?.providerReference ?? null,
    stripePaymentIntentId: latestStripePayment?.providerPaymentId ?? null,
  };
}

export async function saveStripeCheckoutSessionForOrder(input: {
  orderId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}) {
  const order = await db.order.findUnique({
    where: {
      id: input.orderId,
    },
    select: {
      id: true,
      storeId: true,
      currencyCode: true,
      totalAmount: true,
    },
  });

  if (order === null) {
    throw new Error("Order not found.");
  }

  const existing = await db.payment.findFirst({
    where: {
      orderId: input.orderId,
      provider: STRIPE_PROVIDER,
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return db.payment.update({
      where: {
        id: existing.id,
      },
      data: {
        provider: STRIPE_PROVIDER,
        providerReference: input.stripeCheckoutSessionId,
        providerPaymentId: input.stripePaymentIntentId,
        updatedAt: new Date(),
      },
    });
  }

  return db.payment.create({
    data: {
      storeId: order.storeId,
      orderId: order.id,
      status: "PENDING",
      methodType: "CARD",
      currencyCode: order.currencyCode,
      amountAuthorized: order.totalAmount,
      amountCaptured: null,
      provider: STRIPE_PROVIDER,
      providerReference: input.stripeCheckoutSessionId,
      providerPaymentId: input.stripePaymentIntentId,
    },
  });
}
