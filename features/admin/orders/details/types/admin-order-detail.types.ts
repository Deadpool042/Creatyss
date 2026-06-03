import type { OrderEmailEvent } from "@/features/email/order-email.types";
import type { OrderStatus } from "@/entities/order/order-status-transition";
import type { AdminOrderPaymentStatus } from "@/features/admin/orders/list/types/admin-order-list.types";

export type AdminOrderAddress = {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  line1: string;
  line2: string | null;
  postalCode: string;
  city: string;
  region: string | null;
  countryCode: string;
  phone: string | null;
};

export type AdminOrderLine = {
  id: string;
  productName: string;
  variantName: string | null;
  sku: string | null;
  quantity: number;
  unitPriceAmount: string;
  lineTotalAmount: string;
  productSlug: string | null;
  variantSlug: string | null;
};

export type AdminOrderPayment = {
  id: string;
  status: AdminOrderPaymentStatus;
  methodType: string | null;
  amountAuthorized: string | null;
  amountCaptured: string | null;
  amountRefunded: string | null;
  provider: string | null;
  providerReference: string | null;
};

export type AdminOrderShipment = {
  id: string;
  status: string;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
};

export type AdminOrderDetail = {
  id: string;
  reference: string;
  status: OrderStatus;
  currencyCode: string;
  totalAmount: string;
  subtotalAmount: string;
  shippingAmount: string;
  discountAmount: string;
  taxAmount: string;
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  customerPhone: string | null;
  notes: string | null;
  placedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  shippingAddress: AdminOrderAddress | null;
  billingAddress: AdminOrderAddress | null;
  lines: AdminOrderLine[];
  payment: AdminOrderPayment | null;
  shipment: AdminOrderShipment | null;
  emailEvents: OrderEmailEvent[];
};
