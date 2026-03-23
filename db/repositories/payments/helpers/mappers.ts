import { Prisma } from "@prisma/client";
import type {
  PaymentMethodKind,
  PaymentRecord,
  PaymentStatus,
} from "@db-payments/core";
import type { PaymentRow } from "@db-payments/types/rows";

export function mapPaymentStatusToPrisma(
  status: PaymentStatus
):
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED" {
  switch (status) {
    case "pending":
      return "PENDING";
    case "authorized":
      return "AUTHORIZED";
    case "captured":
      return "CAPTURED";
    case "failed":
      return "FAILED";
    case "cancelled":
      return "CANCELLED";
    case "refunded":
      return "REFUNDED";
    case "partially_refunded":
      return "PARTIALLY_REFUNDED";
  }
}

export function mapPaymentMethodKindToPrisma(
  methodKind: PaymentMethodKind
): "CARD" | "BANK_TRANSFER" | "GIFT_CARD" | "OTHER" {
  switch (methodKind) {
    case "card":
      return "CARD";
    case "bank_transfer":
      return "BANK_TRANSFER";
    case "gift_card":
      return "GIFT_CARD";
    case "other":
      return "OTHER";
  }
}

function mapPaymentStatus(
  status:
    | "PENDING"
    | "AUTHORIZED"
    | "CAPTURED"
    | "FAILED"
    | "CANCELLED"
    | "REFUNDED"
    | "PARTIALLY_REFUNDED"
): PaymentStatus {
  switch (status) {
    case "PENDING":
      return "pending";
    case "AUTHORIZED":
      return "authorized";
    case "CAPTURED":
      return "captured";
    case "FAILED":
      return "failed";
    case "CANCELLED":
      return "cancelled";
    case "REFUNDED":
      return "refunded";
    case "PARTIALLY_REFUNDED":
      return "partially_refunded";
  }
}

function mapPaymentMethodKind(
  methodKind: "CARD" | "BANK_TRANSFER" | "GIFT_CARD" | "OTHER"
): PaymentMethodKind {
  switch (methodKind) {
    case "CARD":
      return "card";
    case "BANK_TRANSFER":
      return "bank_transfer";
    case "GIFT_CARD":
      return "gift_card";
    case "OTHER":
      return "other";
  }
}

export function normalizePaymentAmount(amount: string): Prisma.Decimal {
  return new Prisma.Decimal(amount);
}

export function mapPaymentRecord(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    orderId: row.orderId,
    status: mapPaymentStatus(row.status),
    methodKind: mapPaymentMethodKind(row.methodKind),
    amount: row.amount.toString(),
    currencyCode: row.currencyCode,
    providerName: row.providerName,
    providerReference: row.providerReference,
    providerPaymentIntentRef: row.providerPaymentIntentRef,
    authorizedAt: row.authorizedAt,
    capturedAt: row.capturedAt,
    failedAt: row.failedAt,
    cancelledAt: row.cancelledAt,
    refundedAt: row.refundedAt,
    failureCode: row.failureCode,
    failureMessage: row.failureMessage,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
