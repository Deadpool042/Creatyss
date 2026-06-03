import type { OrderStatus } from "@/entities/order/order-status";
import type { AdminOrderPaymentStatus } from "@/features/admin/commerce/orders/list/types/admin-order-list.types";

export type AdminOrdersOverviewRecentOrder = {
  id: string;
  reference: string;
  status: OrderStatus;
  paymentStatus: AdminOrderPaymentStatus;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  createdAt: string;
};

export type AdminOrdersOverviewStats = {
  totalCount: number;
  paidCount: number;
  preparingCount: number;
  shippedCount: number;
  cancelledCount: number;
  paymentIssueCount: number;
  failedEmailCount: number;
  recentOrders: AdminOrdersOverviewRecentOrder[];
};
