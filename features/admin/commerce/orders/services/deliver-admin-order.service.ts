import { db } from "@/core/db";
import type { DeliverOrderInput } from "@/features/admin/commerce/orders/schemas/deliver-order.schema";
import { AdminOrderServiceError } from "@/features/admin/commerce/orders/services/admin-order-service.errors";

export async function deliverAdminOrder(input: DeliverOrderInput): Promise<void> {
  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: input.orderId },
      select: {
        id: true,
        shipments: {
          where: {
            cancelledAt: null,
          },
          orderBy: [{ shippedAt: "desc" }, { createdAt: "desc" }],
          take: 1,
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (order === null) {
      throw new AdminOrderServiceError("missing_order", "Commande introuvable.");
    }

    const shipment = order.shipments[0];

    if (!shipment || shipment.status !== "SHIPPED") {
      throw new AdminOrderServiceError(
        "invalid_shipment_transition",
        "Transition de statut d'expédition non autorisée."
      );
    }

    await tx.shipment.update({
      where: { id: shipment.id },
      data: {
        status: "DELIVERED",
        deliveredAt: new Date(),
      },
    });
  });
}
