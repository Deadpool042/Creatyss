import type { CartCustomerKind, CartOwnerKind } from "@db-cart/types/ownership";

export type CartLineValidity = "valid" | "warning" | "blocking";

export type CartLineIssueCode =
  | "product_not_found"
  | "product_unavailable"
  | "variant_not_found"
  | "variant_unavailable"
  | "price_changed"
  | "stock_reduced"
  | "shipping_method_invalid";

export type CartLineIssue = {
  code: CartLineIssueCode;
  message: string;
};

export type CartLineSnapshot = {
  productName: string;
  productSlug: string;
  variantName: string | null;
  imageStorageKey: string | null;
  unitPriceCents: number | null;
  productKind: "physical" | "digital" | "hybrid";
};

export type AppliedCartDiscount = {
  ruleId: string;
  code: string;
  label: string;
  amountCents: number;
  scope: "cart" | "line";
  lineId: string | null;
};

export type CartLine = {
  id: string;
  itemKey: string;
  productId: string;
  productVariantId: string | null;
  quantity: number;
  snapshot: CartLineSnapshot;
  validity: CartLineValidity;
  issues: CartLineIssue[];
};

export type CartTotals = {
  currencyCode: string;
  subtotalCents: number;
  discountCents: number;
  discountedSubtotalCents: number;
  estimatedShippingCents: number | null;
  estimatedTaxCents: number | null;
  estimatedExciseCents: number | null;
  estimatedTotalCents: number | null;
};

export type Cart = {
  id: string;
  ownerKind: CartOwnerKind;
  customerId: string | null;
  guestToken: string | null;
  customerKind: CartCustomerKind | null;
  shippingRequired: boolean;
  containsPhysicalItems: boolean;
  containsDigitalItems: boolean;
  lines: CartLine[];
  appliedDiscounts: AppliedCartDiscount[];
  totals: CartTotals;
  createdAt: Date;
  updatedAt: Date;
};

export type CartRepositoryErrorCode =
  | "cart_not_found"
  | "cart_line_not_found"
  | "cart_line_quantity_invalid"
  | "cart_product_invalid"
  | "cart_variant_invalid"
  | "cart_unavailable";

export class CartRepositoryError extends Error {
  readonly code: CartRepositoryErrorCode;

  constructor(code: CartRepositoryErrorCode, message: string) {
    super(message);
    this.name = "CartRepositoryError";
    this.code = code;
  }
}
