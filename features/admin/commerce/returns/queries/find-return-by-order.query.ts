import "server-only";

import { db } from "@/core/db";
import type { AdminReturnSummary } from "@/features/admin/commerce/returns/types/admin-return.types";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const ACTIVE_RETURN_STATUSES = [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "RECEIVED",
  "REFUNDED",
  "CLOSED",
  "REJECTED",
] as const;

/** Demande de retour la plus récente (non annulée/archivée) d'une commande. */
export async function findReturnByOrderId(
  storeId: string,
  orderId: string
): Promise<AdminReturnSummary | null> {
  const request = await db.returnRequest.findFirst({
    where: { orderId, storeId, status: { in: [...ACTIVE_RETURN_STATUSES] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      returnNumber: true,
      status: true,
      createdAt: true,
      items: {
        select: { id: true, productName: true, variantName: true, quantity: true },
      },
    },
  });

  if (request === null) {
    return null;
  }

  return {
    id: request.id,
    returnNumber: request.returnNumber,
    status: request.status,
    createdAtLabel: dateFormatter.format(request.createdAt),
    items: request.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      variantName: item.variantName,
      quantity: item.quantity,
    })),
  };
}
