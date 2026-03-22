import type { Payment } from "../payment.types";
import type { Refund } from "../refund.types";
import type { PaymentRow, RefundRow } from "../types/rows";

export function mapPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    orderId: row.orderId,
    provider: row.provider,
    method: row.method,
    status: row.status,
    currency: row.currency,
    amountCents: row.amountCents,
    providerPaymentId: row.providerPaymentId,
    providerIntentId: row.providerIntentId,
    providerCheckoutId: row.providerCheckoutId,
    metadataJson: row.metadataJson,
    paidAt: row.paidAt,
    failedAt: row.failedAt,
    failureCode: row.failureCode,
    failureReason: row.failureReason,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapRefund(row: RefundRow): Refund {
  return {
    id: row.id,
    orderId: row.orderId,
    paymentId: row.paymentId,
    status: row.status,
    amountCents: row.amountCents,
    reason: row.reason,
    providerRefundId: row.providerRefundId,
    processedAt: row.processedAt,
    failureReason: row.failureReason,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
