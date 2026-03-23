import type { CustomerCart } from "@db-cart/customer";

export type MergeGuestCartIntoCustomerCartInput = {
  guestCartId: string;
  customerId: string;
};

export type CartMergeResult = {
  cart: CustomerCart;
  mergedLineCount: number;
  deletedGuestCartId: string;
};
