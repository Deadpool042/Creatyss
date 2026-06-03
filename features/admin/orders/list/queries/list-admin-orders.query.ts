import { db } from "@/core/db";
import { mapAdminOrderSummary } from "@/features/admin/orders/list/mappers/map-admin-order-summary";
import type { AdminOrderSummary } from "@/features/admin/orders/list/types/admin-order-list.types";

export async function listAdminOrders(): Promise<AdminOrderSummary[]> {
  const orders = await db.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      status: true,
      customerEmail: true,
      customerFirstName: true,
      customerLastName: true,
      totalAmount: true,
      createdAt: true,
      updatedAt: true,
      payments: {
        select: {
          status: true,
        },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          lines: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map(mapAdminOrderSummary);
}
