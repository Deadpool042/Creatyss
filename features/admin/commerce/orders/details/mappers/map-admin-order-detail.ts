import { normalizeMoneyString } from "@/core/money";
import {
  toAppOrderStatus,
  toAppPaymentStatus,
  type PrismaOrderStatus,
  type PrismaPaymentStatus,
} from "@/entities/order/order-status";
import { getOrderStatusLabel } from "@/entities/order/order-status-presentation";
import type {
  AdminOrderAddress,
  AdminOrderDetail,
  AdminOrderLine,
  AdminOrderPayment,
  AdminOrderShipment,
  AdminOrderStatusHistoryEntry,
} from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";
import type { OrderEmailEvent } from "@/features/email/order/order-email.types";

type AdminOrderDetailSource = {
  id: string;
  orderNumber: string;
  status: PrismaOrderStatus;
  currencyCode: string;
  totalAmount: { toString(): string };
  subtotalAmount: { toString(): string };
  shippingAmount: { toString(): string };
  discountAmount: { toString(): string };
  taxAmount: { toString(): string };
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  customer: {
    phone: string | null;
  } | null;
  notes: string | null;
  placedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  addresses: Array<{
    type: "BILLING" | "SHIPPING";
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
  }>;
  lines: Array<{
    id: string;
    productName: string;
    variantName: string | null;
    sku: string | null;
    quantity: number;
    unitPriceAmount: { toString(): string };
    lineTotalAmount: { toString(): string };
    productSlug: string | null;
    variantSlug: string | null;
  }>;
  payments: Array<{
    id: string;
    status: PrismaPaymentStatus;
    methodType: string | null;
    amountAuthorized: { toString(): string } | null;
    amountCaptured: { toString(): string } | null;
    amountRefunded: { toString(): string };
    provider: string | null;
    providerReference: string | null;
  }>;
  shipments: Array<{
    id: string;
    status: string;
    carrier: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    shippedAt: Date | null;
    deliveredAt: Date | null;
  }>;
  statusHistory: Array<{
    id: string;
    status: PrismaOrderStatus;
    reasonCode: string | null;
    notes: string | null;
    createdAt: Date;
  }>;
};

function mapAddress(address: AdminOrderDetailSource["addresses"][number]): AdminOrderAddress {
  return {
    firstName: address.firstName,
    lastName: address.lastName,
    company: address.company,
    line1: address.line1,
    line2: address.line2,
    postalCode: address.postalCode,
    city: address.city,
    region: address.region,
    countryCode: address.countryCode,
    phone: address.phone,
  };
}

function mapLine(line: AdminOrderDetailSource["lines"][number]): AdminOrderLine {
  return {
    id: line.id,
    productName: line.productName,
    variantName: line.variantName,
    sku: line.sku,
    quantity: line.quantity,
    unitPriceAmount: normalizeMoneyString(line.unitPriceAmount.toString()),
    lineTotalAmount: normalizeMoneyString(line.lineTotalAmount.toString()),
    productSlug: line.productSlug,
    variantSlug: line.variantSlug,
  };
}

function mapPayment(payment: AdminOrderDetailSource["payments"][number]): AdminOrderPayment {
  return {
    id: payment.id,
    status: toAppPaymentStatus(payment.status),
    methodType: payment.methodType,
    amountAuthorized: payment.amountAuthorized
      ? normalizeMoneyString(payment.amountAuthorized.toString())
      : null,
    amountCaptured: payment.amountCaptured
      ? normalizeMoneyString(payment.amountCaptured.toString())
      : null,
    amountRefunded: normalizeMoneyString(payment.amountRefunded.toString()),
    provider: payment.provider,
    providerReference: payment.providerReference,
  };
}

const statusHistoryDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

function mapStatusHistoryEntry(
  entry: AdminOrderDetailSource["statusHistory"][number]
): AdminOrderStatusHistoryEntry {
  return {
    id: entry.id,
    statusLabel: getOrderStatusLabel(toAppOrderStatus(entry.status)),
    reasonCode: entry.reasonCode,
    note: entry.notes,
    date: statusHistoryDateFormatter.format(entry.createdAt),
  };
}

function mapShipment(shipment: AdminOrderDetailSource["shipments"][number]): AdminOrderShipment {
  return {
    id: shipment.id,
    status: shipment.status,
    carrier: shipment.carrier,
    trackingNumber: shipment.trackingNumber,
    trackingUrl: shipment.trackingUrl,
    shippedAt: shipment.shippedAt?.toISOString() ?? null,
    deliveredAt: shipment.deliveredAt?.toISOString() ?? null,
  };
}

export function mapAdminOrderDetail(input: {
  order: AdminOrderDetailSource;
  emailEvents: OrderEmailEvent[];
}): AdminOrderDetail {
  const shippingAddress =
    input.order.addresses.find((address) => address.type === "SHIPPING") ?? null;
  const billingAddress =
    input.order.addresses.find((address) => address.type === "BILLING") ?? null;
  const latestPayment = input.order.payments[0] ?? null;
  const latestShipment = input.order.shipments[0] ?? null;

  return {
    id: input.order.id,
    reference: input.order.orderNumber,
    status: toAppOrderStatus(input.order.status),
    currencyCode: input.order.currencyCode,
    totalAmount: normalizeMoneyString(input.order.totalAmount.toString()),
    subtotalAmount: normalizeMoneyString(input.order.subtotalAmount.toString()),
    shippingAmount: normalizeMoneyString(input.order.shippingAmount.toString()),
    discountAmount: normalizeMoneyString(input.order.discountAmount.toString()),
    taxAmount: normalizeMoneyString(input.order.taxAmount.toString()),
    customerEmail: input.order.customerEmail,
    customerFirstName: input.order.customerFirstName,
    customerLastName: input.order.customerLastName,
    customerPhone: input.order.customer?.phone ?? shippingAddress?.phone ?? null,
    notes: input.order.notes,
    placedAt: input.order.placedAt?.toISOString() ?? null,
    cancelledAt: input.order.cancelledAt?.toISOString() ?? null,
    createdAt: input.order.createdAt.toISOString(),
    updatedAt: input.order.updatedAt.toISOString(),
    shippingAddress: shippingAddress ? mapAddress(shippingAddress) : null,
    billingAddress: billingAddress ? mapAddress(billingAddress) : null,
    lines: input.order.lines.map(mapLine),
    payment: latestPayment ? mapPayment(latestPayment) : null,
    shipment: latestShipment ? mapShipment(latestShipment) : null,
    emailEvents: input.emailEvents,
    statusHistory: input.order.statusHistory.map(mapStatusHistoryEntry),
  };
}
