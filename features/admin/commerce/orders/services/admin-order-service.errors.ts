export type AdminOrderServiceErrorCode =
  | "missing_order"
  | "invalid_status_transition"
  | "invalid_shipment_transition";

export class AdminOrderServiceError extends Error {
  readonly code: AdminOrderServiceErrorCode;

  constructor(code: AdminOrderServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AdminOrderServiceError";
    this.code = code;
  }
}
