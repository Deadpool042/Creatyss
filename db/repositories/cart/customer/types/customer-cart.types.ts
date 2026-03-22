import type { Cart } from "@db-cart/core/types/cart.types";

export type CustomerCart = Cart & {
  ownerKind: "customer";
  customerId: string;
  guestToken: null;
};

export type CreateCustomerCartInput = {
  customerId: string;
};

export type CustomerCartRepositoryErrorCode =
  | "customer_cart_not_found"
  | "customer_cart_customer_invalid";

export class CustomerCartRepositoryError extends Error {
  readonly code: CustomerCartRepositoryErrorCode;

  constructor(code: CustomerCartRepositoryErrorCode, message: string) {
    super(message);
    this.name = "CustomerCartRepositoryError";
    this.code = code;
  }
}
