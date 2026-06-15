import {
  getAllowedOrderStatusTransitions,
  type OrderStatus,
} from "@/entities/order/order-status-transition";
import {
  getOrderStatusLabel,
  getOrderStatusSummary,
  getPaymentStatusLabel,
  type OrderStatusSummary,
} from "@/entities/order/order-status-presentation";
import {
  getOrderDetailErrorMessage,
  getOrderDetailStatusMessage,
  formatOrderDateTime,
  formatOptionalOrderDateTime,
  readOrderDetailSearchParam,
} from "@/features/admin/commerce/orders/mappers/order-detail-mappers";
import { getShipmentStatusLabel } from "@/features/admin/commerce/orders/config/order-ui.config";
import type {
  AdminOrderDetail,
  AdminOrderStatusHistoryEntry,
} from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";
import type { OrderDetailSearchParams } from "@/features/admin/commerce/orders/types/order-detail-types";

export type AdminOrderDetailViewModel = {
  orderMeta: {
    id: string;
    reference: string;
    trackingReference: string | null;
    carrier: string | null;
    trackingUrl: string | null;
    createdAtLabel: string;
    statusLabel: string;
    paymentStatusLabel: string;
  };
  shippingInfo: {
    statusLabel: string;
    status: string | null;
    shippedAtLabel: string | null;
    deliveredAtLabel: string | null;
    trackingReference: string | null;
    trackingUrl: string | null;
    carrier: string | null;
  };
  customer: {
    fullName: string;
    email: string;
    phone: string | null;
  };
  shippingAddress: {
    line1: string;
    line2: string | null;
    postalCode: string;
    city: string;
    countryCode: string;
  } | null;
  billing:
    | {
        sameAsShipping: false;
        fullName: string | null;
        phone: string | null;
        line1: string | null;
        line2: string | null;
        postalCode: string | null;
        city: string | null;
        countryCode: string | null;
      }
    | {
        sameAsShipping: true;
        fullName: null;
        phone: null;
        line1: null;
        line2: null;
        postalCode: null;
        city: null;
        countryCode: null;
      };
  allowedTransitions: readonly OrderStatus[];
  summary: OrderStatusSummary;
  statusHistory: AdminOrderStatusHistoryEntry[];
  statusMessage: string | null;
  errorMessage: string | null;
};

export function buildAdminOrderDetailViewModel(
  order: AdminOrderDetail,
  searchParams: OrderDetailSearchParams
): AdminOrderDetailViewModel {
  const paymentStatus = order.payment?.status ?? "pending";
  const allowedTransitions = getAllowedOrderStatusTransitions(order.status);
  const summary = getOrderStatusSummary({
    orderStatus: order.status,
    paymentStatus,
  });
  const orderStatusLabel = getOrderStatusLabel(order.status);
  const paymentStatusLabel = getPaymentStatusLabel(paymentStatus);

  const trackingReference = order.shipment?.trackingNumber ?? null;

  const orderMeta: AdminOrderDetailViewModel["orderMeta"] = {
    id: order.id,
    reference: order.reference,
    trackingReference,
    carrier: order.shipment?.carrier ?? null,
    trackingUrl: order.shipment?.trackingUrl ?? null,
    createdAtLabel: formatOrderDateTime(order.createdAt),
    statusLabel: orderStatusLabel,
    paymentStatusLabel,
  };

  const shippingInfo: AdminOrderDetailViewModel["shippingInfo"] = {
    statusLabel: getShipmentStatusLabel(order.shipment?.status ?? null),
    status: order.shipment?.status ?? null,
    shippedAtLabel: formatOptionalOrderDateTime(
      order.shipment?.shippedAt ?? null
    ),
    deliveredAtLabel: formatOptionalOrderDateTime(
      order.shipment?.deliveredAt ?? null
    ),
    trackingReference,
    trackingUrl: order.shipment?.trackingUrl ?? null,
    carrier: order.shipment?.carrier ?? null,
  };

  const customer: AdminOrderDetailViewModel["customer"] = {
    fullName:
      `${order.customerFirstName ?? ""} ${order.customerLastName ?? ""}`.trim() ||
      "—",
    email: order.customerEmail ?? "",
    phone: order.customerPhone,
  };

  const sa = order.shippingAddress;
  const shippingAddress: AdminOrderDetailViewModel["shippingAddress"] = sa
    ? {
        line1: sa.line1,
        line2: sa.line2,
        postalCode: sa.postalCode,
        city: sa.city,
        countryCode: sa.countryCode,
      }
    : null;

  const ba = order.billingAddress;
  const billing: AdminOrderDetailViewModel["billing"] = ba
    ? {
        sameAsShipping: false as const,
        fullName:
          `${ba.firstName ?? ""} ${ba.lastName ?? ""}`.trim() || null,
        phone: ba.phone,
        line1: ba.line1,
        line2: ba.line2,
        postalCode: ba.postalCode,
        city: ba.city,
        countryCode: ba.countryCode,
      }
    : {
        sameAsShipping: true as const,
        fullName: null,
        phone: null,
        line1: null,
        line2: null,
        postalCode: null,
        city: null,
        countryCode: null,
      };

  const orderStatusParam = readOrderDetailSearchParam(
    searchParams,
    "order_status"
  );
  const orderErrorParam = readOrderDetailSearchParam(
    searchParams,
    "order_error"
  );
  const statusMessage = getOrderDetailStatusMessage(orderStatusParam);
  const errorMessage = getOrderDetailErrorMessage(orderErrorParam);

  return {
    orderMeta,
    shippingInfo,
    customer,
    shippingAddress,
    billing,
    allowedTransitions,
    summary,
    statusHistory: order.statusHistory,
    statusMessage,
    errorMessage,
  };
}
