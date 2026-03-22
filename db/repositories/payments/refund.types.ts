export type RefundStatus = "pending" | "succeeded" | "failed" | "cancelled";

export type Refund = {
  id: string;
  orderId: string;
  paymentId: string | null;
  status: RefundStatus;
  amountCents: number;
  reason: string | null;
  providerRefundId: string | null;
  processedAt: Date | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateRefundInput = {
  orderId: string;
  paymentId?: string | null;
  amountCents: number;
  reason?: string | null;
  providerRefundId?: string | null;
};

export type MarkRefundSucceededInput = {
  id: string;
  providerRefundId?: string | null;
  processedAt?: Date;
};

export type MarkRefundFailedInput = {
  id: string;
  failureReason: string;
};

export type RefundRepositoryErrorCode =
  | "refund_not_found"
  | "refund_order_not_found"
  | "refund_payment_invalid"
  | "refund_amount_invalid"
  | "refund_failure_reason_invalid";

export class RefundRepositoryError extends Error {
  readonly code: RefundRepositoryErrorCode;

  constructor(code: RefundRepositoryErrorCode, message: string) {
    super(message);
    this.name = "RefundRepositoryError";
    this.code = code;
  }
}
