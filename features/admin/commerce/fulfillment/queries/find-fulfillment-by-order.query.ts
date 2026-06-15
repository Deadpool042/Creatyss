import "server-only";

import { db } from "@/core/db";
import type { AdminFulfillmentSummary } from "@/features/admin/commerce/fulfillment/types/admin-fulfillment.types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

/** Préparation active d'une commande (hors annulée/archivée), ou null. */
export async function findFulfillmentByOrderId(
  storeId: string,
  orderId: string
): Promise<AdminFulfillmentSummary | null> {
  const fulfillment = await db.fulfillment.findFirst({
    where: {
      orderId,
      storeId,
      status: { notIn: ["CANCELLED", "ARCHIVED"] },
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      fulfilledAt: true,
      createdAt: true,
      items: {
        select: {
          id: true,
          orderLineId: true,
          quantity: true,
          orderLine: { select: { productName: true } },
        },
      },
    },
  });

  if (fulfillment === null) {
    return null;
  }

  return {
    id: fulfillment.id,
    status: fulfillment.status,
    fulfilledAtLabel: fulfillment.fulfilledAt
      ? dateFormatter.format(fulfillment.fulfilledAt)
      : null,
    createdAtLabel: dateFormatter.format(fulfillment.createdAt),
    items: fulfillment.items.map((item) => ({
      id: item.id,
      orderLineId: item.orderLineId,
      productName: item.orderLine.productName,
      quantity: item.quantity,
    })),
  };
}
