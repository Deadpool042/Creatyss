export type CartStatus = "active" | "converted" | "abandoned" | "expired";
export type CartOwnerKind = "guest" | "customer";

export type CartLine = {
  id: string;
  variantId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Cart = {
  id: string;
  storeId: string;
  customerId: string | null;
  ownerKind: CartOwnerKind;
  currencyCode: string;
  status: CartStatus;
  email: string | null;
  expiresAt: Date | null;
  convertedAt: Date | null;
  abandonedAt: Date | null;
  lines: CartLine[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCartInput = {
  storeId: string;
  currencyCode: string;
  customerId?: string | null;
  email?: string | null;
  expiresAt?: Date | null;
};

export type AddCartLineInput = {
  cartId: string;
  variantId: string;
  quantity: number;
};

export type UpdateCartLineQuantityInput = {
  cartId: string;
  lineId: string;
  quantity: number;
};

export class CartRepositoryError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "CartRepositoryError";
    this.code = code;
  }
}
