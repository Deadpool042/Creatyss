import { db } from "@/core/db";
import { listOrderEmailEventsByOrderId } from "@/features/email/order/order-email.repository";
import { mapAdminOrderDetail } from "@/features/admin/commerce/orders/details/mappers/map-admin-order-detail";
import type { AdminOrderDetail } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";

export async function findAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  if (id.trim().length === 0) {
    return null;
  }

  const order = await db.order.findUnique({
    where: { id },
    select: {
      id: true,
      orderNumber: true,
      status: true,
      currencyCode: true,
      totalAmount: true,
      subtotalAmount: true,
      shippingAmount: true,
      discountAmount: true,
      taxAmount: true,
      customerEmail: true,
      customerFirstName: true,
      customerLastName: true,
      customer: {
        select: {
          phone: true,
        },
      },
      notes: true,
      placedAt: true,
      cancelledAt: true,
      createdAt: true,
      updatedAt: true,
      addresses: {
        orderBy: { createdAt: "asc" },
      },
      lines: {
        orderBy: { createdAt: "asc" },
      },
      payments: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
      shipments: {
        take: 1,
        orderBy: [{ shippedAt: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (order === null) {
    return null;
  }

  const emailEvents = await listOrderEmailEventsByOrderId(order.id);

  return mapAdminOrderDetail({
    order,
    emailEvents,
  });
}
