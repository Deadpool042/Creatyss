export type AdminShipmentStatus =
  | "pending"
  | "ready"
  | "shipped"
  | "delivered"
  | "returned"
  | "cancelled";

export type AdminShipmentSummary = {
  id: string;
  orderId: string;
  orderReference: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  status: AdminShipmentStatus;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
};

export type AdminShipmentListFilters = {
  status?: AdminShipmentStatus;
  page?: number;
  perPage?: number;
};

export type AdminShipmentListResult = {
  items: readonly AdminShipmentSummary[];
  total: number;
  totalPages: number;
  currentPage: number;
};
