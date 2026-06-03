import { db } from "@/core/db";
import { listAdminOrders } from "@/features/admin/commerce/orders/list/queries/list-admin-orders.query";
import type {
  AdminOrdersOverviewRecentOrder,
  AdminOrdersOverviewStats,
} from "@/features/admin/commerce/orders/overview/types/admin-orders-overview.types";

const EMPTY_OVERVIEW: AdminOrdersOverviewStats = {
  totalCount: 0,
  paidCount: 0,
  preparingCount: 0,
  shippedCount: 0,
  cancelledCount: 0,
  paymentIssueCount: 0,
  failedEmailCount: 0,
  recentOrders: [],
};

function formatCustomerName(input: {
  customerFirstName: string;
  customerLastName: string;
  customerEmail: string;
}): string {
  const fullName = [input.customerFirstName, input.customerLastName].filter(Boolean).join(" ").trim();

  return fullName.length > 0 ? fullName : input.customerEmail;
}

export async function getAdminOrdersOverview(): Promise<AdminOrdersOverviewStats> {
  const [ordersResult, failedEmailOrders] = await Promise.all([
    listAdminOrders(),
    db.emailMessage.findMany({
      where: {
        subjectType: "order",
        status: "FAILED",
        subjectId: { not: null },
      },
      select: {
        subjectId: true,
      },
      distinct: ["subjectId"],
    }),
  ]);

  const orders = ordersResult.items;

  if (orders.length === 0) {
    return EMPTY_OVERVIEW;
  }

  const recentOrders: AdminOrdersOverviewRecentOrder[] = orders.slice(0, 5).map((order) => ({
    id: order.id,
    reference: order.reference,
    status: order.status,
    paymentStatus: order.paymentStatus,
    customerName: formatCustomerName(order),
    customerEmail: order.customerEmail,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt,
  }));

  return {
    totalCount: orders.length,
    paidCount: orders.filter((order) => order.status === "paid").length,
    preparingCount: orders.filter((order) => order.status === "preparing").length,
    shippedCount: orders.filter((order) => order.status === "shipped").length,
    cancelledCount: orders.filter((order) => order.status === "cancelled").length,
    paymentIssueCount: orders.filter(
      (order) => order.status !== "cancelled" && order.paymentStatus === "failed"
    ).length,
    failedEmailCount: failedEmailOrders.length,
    recentOrders,
  };
}
