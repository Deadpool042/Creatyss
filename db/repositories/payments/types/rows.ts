import type { Prisma } from "@prisma/client";

export const paymentSelect = {
  id: true,
  orderId: true,
  status: true,
  methodKind: true,
  amount: true,
  currencyCode: true,
  providerName: true,
  providerReference: true,
  providerPaymentIntentRef: true,
  authorizedAt: true,
  capturedAt: true,
  failedAt: true,
  cancelledAt: true,
  refundedAt: true,
  failureCode: true,
  failureMessage: true,
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.PaymentSelect;

export type PaymentRow = Prisma.PaymentGetPayload<{
  select: typeof paymentSelect;
}>;
