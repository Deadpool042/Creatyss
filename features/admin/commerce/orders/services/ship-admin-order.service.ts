import { db } from "@/core/db";
import { toAppOrderStatus, type PrismaOrderStatus } from "@/entities/order/order-status";
import { resolveOrderStatusTransition } from "@/entities/order/order-status-transition";
import type { ShipOrderInput } from "@/features/admin/commerce/orders/schemas/ship-order.schema";
import { AdminOrderServiceError } from "@/features/admin/commerce/orders/services/admin-order-service.errors";

export async function shipAdminOrder(input: ShipOrderInput): Promise<void> {
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        storeId: true,
        status: true,
        shippingSelection: {
          select: {
            shippingMethodId: true,
          },
        },
        shipments: {
          where: {
            cancelledAt: null,
          },
          orderBy: [{ shippedAt: "desc" }, { createdAt: "desc" }],
          take: 1,
          select: {
            id: true,
          },
        },
      },
    });

    if (order === null) {
      throw new AdminOrderServiceError("missing_order", "Commande introuvable.");
    }

    const currentStatus = toAppOrderStatus(order.status as PrismaOrderStatus);
    const transition = resolveOrderStatusTransition({
      currentStatus,
      nextStatus: "shipped",
    });

    if (!transition.ok) {
      throw new AdminOrderServiceError(
        "invalid_status_transition",
        "Transition de statut non autorisée."
      );
    }

    const shippedAt = new Date();
    const shipmentData = {
      status: "SHIPPED" as const,
      trackingNumber: input.trackingReference,
      shippedAt,
    };

    if (order.shipments[0]) {
      await tx.shipment.update({
        where: { id: order.shipments[0].id },
        data: shipmentData,
      });
    } else {
      await tx.shipment.create({
        data: {
          storeId: order.storeId,
          orderId: order.id,
          shippingMethodId: order.shippingSelection?.shippingMethodId ?? null,
          ...shipmentData,
        },
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "COMPLETED",
        statusHistory: {
          create: {
            status: "COMPLETED",
            reasonCode: "admin_order_shipped",
          },
        },
      },
    });
  });
}
