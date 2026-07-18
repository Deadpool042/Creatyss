import "server-only";

import { db } from "@/core/db";
import { isValidOrderReference } from "@/entities/order/order-reference";
import type { PrismaOrderStatus } from "@/entities/order/order-status";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type { IdentifyOrderForReturnResult } from "@/features/commerce/returns/types/identify-order-for-return.types";

const NOT_IDENTIFIED: IdentifyOrderForReturnResult = { outcome: "NOT_IDENTIFIED" };

export type IdentifyOrderForReturnInput = {
  reference: string;
  email: string;
};

/**
 * Identifie une commande pour une éventuelle demande de retour storefront à
 * partir d'une référence de commande et d'un email, sans authentification
 * supplémentaire.
 *
 * Contrat de sécurité : en cas d'échec (référence inconnue, email erroné ou
 * commande introuvable), retourne systématiquement `{ outcome:
 * "NOT_IDENTIFIED" }` — jamais un modèle Prisma brut, jamais une raison
 * d'échec distincte. Ne réutilise pas `findPublicOrderByReference`, dont le
 * contrat public (aucune vérification d'email, page de confirmation) ne
 * doit pas être modifié.
 */
export async function identifyOrderForReturn(
  input: IdentifyOrderForReturnInput
): Promise<IdentifyOrderForReturnResult> {
  const reference = input.reference.trim();
  const email = input.email.trim().toLowerCase();

  if (!isValidOrderReference(reference) || email.length === 0) {
    return NOT_IDENTIFIED;
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return NOT_IDENTIFIED;
  }

  const order = await db.order.findFirst({
    where: { storeId, orderNumber: reference },
    select: {
      id: true,
      status: true,
      customerEmail: true,
      lines: { select: { id: true, quantity: true } },
      shipments: {
        where: { deliveredAt: { not: null } },
        orderBy: { deliveredAt: "desc" },
        take: 1,
        select: { deliveredAt: true },
      },
      returnRequests: {
        select: {
          status: true,
          items: { select: { orderLineId: true, quantity: true } },
        },
      },
    },
  });

  if (order === null || order.customerEmail === null) {
    return NOT_IDENTIFIED;
  }

  if (order.customerEmail.trim().toLowerCase() !== email) {
    return NOT_IDENTIFIED;
  }

  return {
    outcome: "IDENTIFIED",
    order: {
      orderId: order.id,
      status: order.status as PrismaOrderStatus,
      lines: order.lines.map((line) => ({ orderLineId: line.id, quantity: line.quantity })),
      shipment: order.shipments[0] ? { deliveredAt: order.shipments[0].deliveredAt } : null,
      existingReturnRequests: order.returnRequests.map((request) => ({
        status: request.status,
        items: request.items.map((item) => ({
          orderLineId: item.orderLineId,
          quantity: item.quantity,
        })),
      })),
    },
  };
}
