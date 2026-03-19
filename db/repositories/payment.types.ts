type OrderStatus = "pending" | "paid" | "preparing" | "shipped" | "cancelled";

export type PaymentStatus = "pending" | "succeeded" | "failed";

export type PaymentStartContext = {
  orderId: string;
  reference: string;
  orderStatus: OrderStatus;
  customerEmail: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
};

export type SaveStripeCheckoutSessionForOrderInput = {
  orderId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
};

export type MarkPaymentSucceededByCheckoutSessionIdInput = {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
};

export type MarkPaymentFailedByCheckoutSessionIdInput = {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
};
