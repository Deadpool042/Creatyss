import type { Prisma } from "@/prisma-generated/client";
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

    if (transition.shouldRestock) {
      await restockCancelledOrderInventory(tx, order.id);
    }
  });
}

/**
 * Restitue le stock consommé à la création d'une commande, de façon idempotente.
 *
 * Charge les InventoryMovement referenceType="order" de type CONSUMPTION ou RELEASE,
 * groupe par inventoryItemId, et n'incrémente que si le net est encore négatif.
 */
export async function restockCancelledOrderInventory(
  tx: Prisma.TransactionClient,
  orderId: string
): Promise<void> {
  const movements = await tx.inventoryMovement.findMany({
    where: {
      referenceType: "order",
      referenceId: orderId,
      type: { in: ["CONSUMPTION", "RELEASE"] },
    },
    select: {
      inventoryItemId: true,
      quantityDelta: true,
    },
  });

  if (movements.length === 0) return;

  const netByItem = new Map<string, number>();
  for (const m of movements) {
    netByItem.set(m.inventoryItemId, (netByItem.get(m.inventoryItemId) ?? 0) + m.quantityDelta);
  }

  for (const [inventoryItemId, net] of netByItem) {
    if (net >= 0) continue;

    const restoreQty = -net;

    await tx.inventoryItem.update({
      where: { id: inventoryItemId },
      data: { onHandQuantity: { increment: restoreQty } },
    });

    await tx.inventoryMovement.create({
      data: {
        inventoryItemId,
        type: "RELEASE",
        quantityDelta: restoreQty,
        referenceType: "order",
        referenceId: orderId,
        reason: "order_cancelled",
      },
    });
  }
}
