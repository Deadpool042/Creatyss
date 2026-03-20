type ProductStatus = "draft" | "published";
type ProductVariantStatus = "draft" | "published";

export type GuestCartVariant = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productStatus: ProductStatus;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  stockQuantity: number;
  status: ProductVariantStatus;
  isAvailable: boolean;
};

export type GuestCartLine = {
  id: string;
  variantId: string;
  quantity: number;
  productId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  unitPrice: string;
  lineTotal: string;
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
  createdAt: string;
  updatedAt: string;
};

export type GuestCheckoutIssueCode = "empty_cart" | "cart_unavailable";
