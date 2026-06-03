import type { OrderStatus } from "@/entities/order/order-status-transition";

export type AdminOrderPaymentStatus = "pending" | "succeeded" | "failed";

export type AdminOrderSummary = {
  id: string;
  reference: string;
  status: OrderStatus;
  paymentStatus: AdminOrderPaymentStatus;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  totalAmount: string;
  lineCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrderListSort =
  | "created-desc"
  | "created-asc"
  | "updated-desc"
  | "updated-asc";

export type AdminOrderListFilters = {
  search?: string;
  status?: readonly OrderStatus[];
  sort?: AdminOrderListSort;
  page?: number;
  perPage?: number;
};

export type AdminOrderStatusCounts = Partial<Record<OrderStatus, number>>;

export type AdminOrderListResult = {
  items: readonly AdminOrderSummary[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: AdminOrderStatusCounts;
};
