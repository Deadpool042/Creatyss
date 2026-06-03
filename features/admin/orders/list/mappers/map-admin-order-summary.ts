import { normalizeMoneyString } from "@/core/money";
import { toAppOrderStatus, toAppPaymentStatus, type PrismaOrderStatus, type PrismaPaymentStatus } from "@/features/admin/orders/mappers/order-status-mappers";
import type { AdminOrderSummary } from "@/features/admin/orders/list/types/admin-order-list.types";

type AdminOrderSummarySource = {
  id: string;
  orderNumber: string;
  status: PrismaOrderStatus;
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  totalAmount: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
  payments: Array<{
    status: PrismaPaymentStatus;
  }>;
  _count: {
    lines: number;
  };
};

export function mapAdminOrderSummary(order: AdminOrderSummarySource): AdminOrderSummary {
  const latestPayment = order.payments[0];

  return {
    id: order.id,
    reference: order.orderNumber,
    status: toAppOrderStatus(order.status),
    paymentStatus: latestPayment ? toAppPaymentStatus(latestPayment.status) : "pending",
    customerEmail: order.customerEmail ?? "",
    customerFirstName: order.customerFirstName ?? "",
    customerLastName: order.customerLastName ?? "",
    totalAmount: normalizeMoneyString(order.totalAmount.toString()),
    lineCount: order._count.lines,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
