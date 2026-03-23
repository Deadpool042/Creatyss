import type { Cart } from "@db-cart/core";

export type CustomerCart = Cart & {
  ownerKind: "customer";
  customerId: string;
};

export type CreateCustomerCartInput = {
  storeId: string;
  customerId: string;
  currencyCode: string;
  email?: string | null;
  expiresAt?: Date | null;
};
