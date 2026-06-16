import type { OrderStatus } from "@/entities/order/order-status-transition";
export type { OrderStatus };

export type PaymentStatus = "pending" | "succeeded" | "failed";
export type PaymentProvider = "stripe" | "manual" | null;
export type PaymentMethod = "card" | "bank_transfer" | "cash_on_delivery" | "other";

export type OrderLine = {
  id: string;
  sourceProductVariantId: string | null;
  productName: string;
  variantName: string | null;
  colorName: string | null;
  colorHex: string | null;
  sku: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  createdAt: string;
};

export type OrderPayment = {
  status: PaymentStatus;
  provider: PaymentProvider;
  method: PaymentMethod;
  amount: string;
  currency: "eur";
};

export type PublicOrderConfirmation = {
  id: string;
  reference: string;
  status: OrderStatus;
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
  shippedAt: string | null;
  trackingReference: string | null;
  subtotalAmount: string;
  shippingAmount: string;
  totalAmount: string;
  payment: OrderPayment;
  createdAt: string;
  updatedAt: string;
  lines: OrderLine[];
};

export type OrderEmailContext = {
  id: string;
  reference: string;
  customerEmail: string;
  customerFirstName: string;
  totalAmount: string;
  trackingReference: string | null;
  paymentMethod: PaymentMethod | null;
};

export type OrderRepositoryErrorCode =
  | "missing_cart"
  | "empty_cart"
  | "missing_checkout"
  | "missing_shipping_selection"
  | "missing_payment_method"
  | "invalid_discount_code"
  | "shipping_method_unavailable"
  | "insufficient_stock"
  | "tax_address_missing"
  | "tax_resolution_failed"
  | "create_failed";

export class OrderRepositoryError extends Error {
  readonly code: OrderRepositoryErrorCode;
  constructor(code: OrderRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "OrderRepositoryError";
  }
}
