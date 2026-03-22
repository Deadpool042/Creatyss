import type { Cart } from "@db-cart/core/types/cart.types";

export type GuestCart = Cart & {
  ownerKind: "guest";
  guestToken: string;
  customerId: null;
};

export type CreateGuestCartInput = {
  guestToken: string;
};

export type GuestCartRepositoryErrorCode = "guest_cart_not_found" | "guest_cart_token_invalid";

export class GuestCartRepositoryError extends Error {
  readonly code: GuestCartRepositoryErrorCode;

  constructor(code: GuestCartRepositoryErrorCode, message: string) {
    super(message);
    this.name = "GuestCartRepositoryError";
    this.code = code;
  }
}
