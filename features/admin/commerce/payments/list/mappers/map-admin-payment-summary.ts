import { normalizeMoneyString } from "@/core/money";
import type { AdminPaymentMethodType, AdminPaymentStatus, AdminPaymentSummary } from "../types/admin-payment-list.types";

type AdminPaymentSummarySource = {
  id: string;
  orderId: string;
  currencyCode: string;
  amountAuthorized: { toString(): string } | null;
  amountCaptured: { toString(): string } | null;
  status: string;
  methodType: string;
  createdAt: Date;
  capturedAt: Date | null;
  cancelledAt: Date | null;
  order: {
    orderNumber: string;
    customerEmail: string | null;
    customerFirstName: string | null;
    customerLastName: string | null;
  };
};

function toAdminPaymentStatus(status: string): AdminPaymentStatus {
  switch (status) {
    case "PENDING": return "pending";
    case "CAPTURED": return "captured";
    case "CANCELLED": return "cancelled";
    default: return "unknown";
  }
}

function toAdminPaymentMethodType(methodType: string): AdminPaymentMethodType {
  switch (methodType) {
    case "BANK_TRANSFER": return "bank_transfer";
    case "CASH_ON_DELIVERY": return "cash_on_delivery";
    case "CARD": return "card";
    case "WALLET": return "wallet";
    default: return "other";
  }
}

export function mapAdminPaymentSummary(payment: AdminPaymentSummarySource): AdminPaymentSummary {
  return {
    id: payment.id,
    orderId: payment.orderId,
    orderReference: payment.order.orderNumber,
    customerEmail: payment.order.customerEmail ?? "",
    customerFirstName: payment.order.customerFirstName ?? "",
    customerLastName: payment.order.customerLastName ?? "",
    amountAuthorized: payment.amountAuthorized
      ? normalizeMoneyString(payment.amountAuthorized.toString())
      : "0.00",
    amountCaptured: payment.amountCaptured
      ? normalizeMoneyString(payment.amountCaptured.toString())
      : null,
    currencyCode: payment.currencyCode,
    status: toAdminPaymentStatus(payment.status),
    methodType: toAdminPaymentMethodType(payment.methodType),
    createdAt: payment.createdAt.toISOString(),
    capturedAt: payment.capturedAt ? payment.capturedAt.toISOString() : null,
    cancelledAt: payment.cancelledAt ? payment.cancelledAt.toISOString() : null,
  };
}
