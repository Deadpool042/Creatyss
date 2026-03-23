export type PaymentStatus =
  | "pending"
  | "authorized"
  | "captured"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";

export type PaymentMethodKind = "card" | "bank_transfer" | "gift_card" | "other";

export type PaymentRecord = {
  id: string;
  orderId: string;
  status: PaymentStatus;
  methodKind: PaymentMethodKind;
  amount: string;
  currencyCode: string;
  providerName: string | null;
  providerReference: string | null;
  providerPaymentIntentRef: string | null;
  authorizedAt: Date | null;
  capturedAt: Date | null;
  failedAt: Date | null;
  cancelledAt: Date | null;
  refundedAt: Date | null;
  failureCode: string | null;
  failureMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePaymentInput = {
  orderId: string;
  methodKind: PaymentMethodKind;
  amount: string;
  currencyCode: string;
  providerName?: string | null;
  providerReference?: string | null;
  providerPaymentIntentRef?: string | null;
};

export type ProviderPaymentRefsInput = {
  providerName?: string | null;
  providerReference?: string | null;
  providerPaymentIntentRef?: string | null;
};

export type FailPaymentInput = ProviderPaymentRefsInput & {
  failureCode?: string | null;
  failureMessage: string;
};

export class PaymentRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "PaymentRepositoryError";
    this.code = code;
  }
}
