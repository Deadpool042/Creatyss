import { db } from "@/core/db";
import { listOrderEmailEventsByOrderId } from "@/features/email/order/order-email.repository";
import { mapAdminOrderDetail } from "@/features/admin/commerce/orders/details/mappers/map-admin-order-detail";
import type { AdminOrderDetail } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";

export async function findAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  if (id.trim().length === 0) {
    return null;
  }

  const [order, emailEvents] = await Promise.all([
    db.order.findUnique({
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
          select: {
            id: true,
            productName: true,
            variantName: true,
            sku: true,
            quantity: true,
            unitPriceAmount: true,
            lineTotalAmount: true,
            productSlug: true,
            variantSlug: true,
            product: {
              select: {
                primaryImage: {
                  select: {
                    publicUrl: true,
                    altText: true,
                  },
                },
              },
            },
            variant: {
              select: {
                primaryImage: {
                  select: {
                    publicUrl: true,
                    altText: true,
                  },
                },
              },
            },
          },
        },
        payments: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        shipments: {
          take: 1,
          orderBy: [{ shippedAt: "desc" }, { createdAt: "desc" }],
        },
        statusHistory: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            status: true,
            reasonCode: true,
            notes: true,
            createdAt: true,
          },
        },
      },
    }),
    listOrderEmailEventsByOrderId(id),
  ]);

  if (order === null) {
    return null;
  }

  return mapAdminOrderDetail({
    order,
    emailEvents,
  });
}
