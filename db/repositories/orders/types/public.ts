import type { OrderStatus } from "@/entities/order/order-status-transition";

export type { OrderStatus } from "@/entities/order/order-status-transition";

export type PaymentStatus = "pending" | "succeeded" | "failed";
export type PaymentProvider = "stripe";
export type PaymentMethod = "card";

export type OrderLine = {
  id: string;
  sourceProductVariantId: string | null;
  productName: string;
  variantName: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
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
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
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
  totalAmount: string;
  payment: OrderPayment;
  createdAt: string;
  updatedAt: string;
  lines: OrderLine[];
};

export type AdminOrderSummary = {
  id: string;
  reference: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  totalAmount: string;
  lineCount: number;
  createdAt: string;
  updatedAt: string;
};

export type OrderEmailContext = {
  id: string;
  reference: string;
  customerEmail: string;
  customerFirstName: string;
  totalAmount: string;
  trackingReference: string | null;
};

export type CreateOrderFromGuestCartResult = {
  id: string;
  reference: string;
};

export type UpdateOrderStatusInput = {
  id: string;
  nextStatus: OrderStatus;
};

export type ShipOrderInput = {
  id: string;
  trackingReference: string | null;
};

export type OrderRepositoryErrorCode =
  | "missing_cart"
  | "empty_cart"
  | "missing_checkout"
  | "cart_unavailable"
  | "create_failed"
  | "missing_order"
  | "invalid_status_transition";

export class OrderRepositoryError extends Error {
  readonly code: OrderRepositoryErrorCode;

  constructor(code: OrderRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
