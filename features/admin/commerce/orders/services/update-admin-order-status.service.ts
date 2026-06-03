import { db } from "@/core/db";
import {
  toAppOrderStatus,
  toPrismaOrderStatus,
  type PrismaOrderStatus,
} from "@/entities/order/order-status";
import { resolveOrderStatusTransition } from "@/entities/order/order-status-transition";
import type { UpdateOrderStatusInput } from "@/features/admin/commerce/orders/schemas/update-order-status.schema";
import { AdminOrderServiceError } from "@/features/admin/commerce/orders/services/admin-order-service.errors";

export async function updateAdminOrderStatus(input: UpdateOrderStatusInput): Promise<void> {
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        status: true,
      },
    });

    if (order === null) {
      throw new AdminOrderServiceError("missing_order", "Commande introuvable.");
    }

    const currentStatus = toAppOrderStatus(order.status as PrismaOrderStatus);
    const transition = resolveOrderStatusTransition({
      currentStatus,
      nextStatus: input.nextStatus,
    });

    if (!transition.ok || input.nextStatus === "shipped") {
      throw new AdminOrderServiceError(
        "invalid_status_transition",
        "Transition de statut non autorisée."
      );
    }

    const nextPrismaStatus = toPrismaOrderStatus(input.nextStatus);

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: nextPrismaStatus,
        cancelledAt: input.nextStatus === "cancelled" ? new Date() : null,
        statusHistory: {
          create: {
            status: nextPrismaStatus,
            reasonCode: "admin_manual_transition",
          },
        },
      },
    });
  });
}
