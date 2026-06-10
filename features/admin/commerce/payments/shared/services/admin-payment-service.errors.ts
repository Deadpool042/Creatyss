export type AdminPaymentServiceErrorCode =
  | "missing_payment"
  | "forbidden"
  | "invalid_status_transition";

export class AdminPaymentServiceError extends Error {
  readonly code: AdminPaymentServiceErrorCode;

  constructor(code: AdminPaymentServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AdminPaymentServiceError";
    this.code = code;
  }
}
