export type MergeGuestCartIntoCustomerCartInput = {
  guestToken: string;
  customerId: string;
};

export type CartMergeResult = {
  customerCartId: string;
  mergedLineCount: number;
  invalidatedGuestCartId: string | null;
};

export type CartMergeRepositoryErrorCode =
  | "cart_merge_guest_not_found"
  | "cart_merge_customer_invalid"
  | "cart_merge_conflict";

export class CartMergeRepositoryError extends Error {
  readonly code: CartMergeRepositoryErrorCode;

  constructor(code: CartMergeRepositoryErrorCode, message: string) {
    super(message);
    this.name = "CartMergeRepositoryError";
    this.code = code;
  }
}
