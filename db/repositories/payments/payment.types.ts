export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "cancelled"
  | "partially_refunded"
  | "refunded";

export type PaymentProvider = "stripe" | "manual";

export type Payment = {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  method: string;
  status: PaymentStatus;
  currency: string;
  amountCents: number;
  providerPaymentId: string | null;
  providerIntentId: string | null;
  providerCheckoutId: string | null;
  metadataJson: unknown;
  paidAt: Date | null;
  failedAt: Date | null;
  failureCode: string | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePaymentInput = {
  orderId: string;
  provider: PaymentProvider;
  method: string;
  currency: string;
  amountCents: number;
  providerPaymentId?: string | null;
  providerIntentId?: string | null;
  providerCheckoutId?: string | null;
  metadataJson?: unknown;
};

export type MarkPaymentPaidInput = {
  id: string;
  providerPaymentId?: string | null;
  providerIntentId?: string | null;
  providerCheckoutId?: string | null;
  paidAt?: Date;
};

export type MarkPaymentFailedInput = {
  id: string;
  failureCode?: string | null;
  failureReason: string;
  failedAt?: Date;
};

export type PaymentRepositoryErrorCode =
  | "payment_not_found"
  | "payment_order_not_found"
  | "payment_amount_invalid"
  | "payment_method_invalid"
  | "payment_failure_reason_invalid";

export class PaymentRepositoryError extends Error {
  readonly code: PaymentRepositoryErrorCode;

  constructor(code: PaymentRepositoryErrorCode, message: string) {
    super(message);
    this.name = "PaymentRepositoryError";
    this.code = code;
  }
}
