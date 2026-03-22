import type { Prisma } from "@prisma/client";

export const paymentSelect = {
  id: true,
  orderId: true,
  provider: true,
  method: true,
  status: true,
  currency: true,
  amountCents: true,
  providerPaymentId: true,
  providerIntentId: true,
  providerCheckoutId: true,
  metadataJson: true,
  paidAt: true,
  failedAt: true,
  failureCode: true,
  failureReason: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.PaymentSelect;

export const refundSelect = {
  id: true,
  orderId: true,
  paymentId: true,
  status: true,
  amountCents: true,
  reason: true,
  providerRefundId: true,
  processedAt: true,
  failureReason: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RefundSelect;

export type PaymentRow = Prisma.PaymentGetPayload<{
  select: typeof paymentSelect;
}>;

export type RefundRow = Prisma.RefundGetPayload<{
  select: typeof refundSelect;
}>;
