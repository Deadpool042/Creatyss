import type { Cart } from "@db-cart/core";

export type GuestCart = Cart & {
  ownerKind: "guest";
  customerId: null;
};

export type CreateGuestCartInput = {
  storeId: string;
  currencyCode: string;
  email?: string | null;
  expiresAt?: Date | null;
};
