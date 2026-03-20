import type {
  GuestCart,
  GuestCheckoutDetails,
  GuestCheckoutIssueCode,
} from "./guest-cart/types/internal";

export type {
  GuestCartVariant,
  GuestCartLine,
  GuestCart,
  GuestCheckoutDetails,
  GuestCheckoutIssueCode,
} from "./guest-cart/types/internal";

export type AddGuestCartItemQuantityInput = {
  cartId: string;
  variantId: string;
  quantity: number;
};

export type UpdateGuestCartItemQuantityInput = {
  cartId: string;
  itemId: string;
  quantity: number;
};

export type RemoveGuestCartItemInput = {
  cartId: string;
  itemId: string;
};

export type GuestCartItemReference = {
  id: string;
  variantId: string;
  quantity: number;
};

export type GuestCheckoutContext = {
  cart: GuestCart | null;
  draft: GuestCheckoutDetails | null;
  issues: GuestCheckoutIssueCode[];
};

export type UpsertGuestCheckoutDetailsInput = {
  cartId: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingPostalCode: string;
  shippingCity: string;
  shippingCountryCode: "FR";
  billingSameAsShipping: boolean;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingPhone: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountryCode: "FR" | null;
};
