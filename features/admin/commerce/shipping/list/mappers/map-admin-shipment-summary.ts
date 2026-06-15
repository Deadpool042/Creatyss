import type { AdminShipmentStatus, AdminShipmentSummary } from "../types/admin-shipment-list.types";

type AdminShipmentSummarySource = {
  id: string;
  orderId: string;
  status: string;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: Date | null;
  deliveredAt: Date | null;
  createdAt: Date;
  order: {
    orderNumber: string;
    customerEmail: string | null;
    customerFirstName: string | null;
    customerLastName: string | null;
  };
};

function toAdminShipmentStatus(status: string): AdminShipmentStatus {
  switch (status) {
    case "READY":
      return "ready";
    case "SHIPPED":
      return "shipped";
    case "DELIVERED":
      return "delivered";
    case "RETURNED":
      return "returned";
    case "CANCELLED":
      return "cancelled";
    case "PENDING":
    default:
      return "pending";
  }
}

export function mapAdminShipmentSummary(shipment: AdminShipmentSummarySource): AdminShipmentSummary {
  return {
    id: shipment.id,
    orderId: shipment.orderId,
    orderReference: shipment.order.orderNumber,
    customerEmail: shipment.order.customerEmail ?? "",
    customerFirstName: shipment.order.customerFirstName ?? "",
    customerLastName: shipment.order.customerLastName ?? "",
    status: toAdminShipmentStatus(shipment.status),
    carrier: shipment.carrier,
    trackingNumber: shipment.trackingNumber,
    trackingUrl: shipment.trackingUrl,
    shippedAt: shipment.shippedAt ? shipment.shippedAt.toISOString() : null,
    deliveredAt: shipment.deliveredAt ? shipment.deliveredAt.toISOString() : null,
    createdAt: shipment.createdAt.toISOString(),
  };
}
