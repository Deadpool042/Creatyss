export type GuestCartVariant = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productStatus: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  name: string | null;
  sku: string;
  unitPriceAmount: string;
  stockQuantity: number;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";
  /** Vendabilité portée par availability (isSellable + statut vendable). */
  isSellable: boolean;
  isAvailable: boolean;
};

export type GuestCartItemReference = {
  id: string;
  variantId: string;
  quantity: number;
};

export type GuestCartLine = {
  id: string;
  variantId: string;
  quantity: number;
  productId: string;
  productSlug: string;
  productName: string;
  variantName: string | null;
  sku: string | null;
  unitPriceAmount: string;
  lineTotalAmount: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GuestCart = {
  id: string;
  itemCount: number;
  subtotal: string;
  lines: GuestCartLine[];
};

export type GuestCheckoutShippingSelection = {
  methodCode: string;
  methodName: string;
  amountCents: number;
  currencyCode: string;
};

export type GuestCheckoutDetails = {
  id: string;
  cartId: string;
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  customerPhone: string | null;
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  shippingPostalCode: string | null;
  shippingCity: string | null;
  shippingCountryCode: "FR" | null;
  billingSameAsShipping: boolean;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingPhone: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountryCode: "FR" | null;
  shippingSelection: GuestCheckoutShippingSelection | null;
  createdAt: string;
  updatedAt: string;
};

export type GuestCheckoutIssueCode = "empty_cart" | "cart_unavailable";

export type GuestCheckoutContext = {
  cart: GuestCart | null;
  draft: GuestCheckoutDetails | null;
  issues: GuestCheckoutIssueCode[];
};
