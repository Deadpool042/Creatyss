import "server-only";

import { randomUUID } from "node:crypto";

import { withTransaction } from "@/core/db/transactions/with-transaction";

export class CreateReturnRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateReturnRequestError";
  }
}

type CreateReturnRequestInput = {
  orderId: string;
  storeId: string;
};

const ACTIVE_RETURN_STATUSES = [
  "REQUESTED",
  "UNDER_REVIEW",
  "APPROVED",
  "RECEIVED",
  "REFUNDED",
] as const;

function generateReturnNumber(year: number): string {
  return `RET-${year}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

/**
 * Crée une demande de retour « commande entière » (toutes les lignes) en statut
 * REQUESTED. Une seule demande active par commande. Snapshot produit figé.
 * Ne touche ni stock, ni paiement, ni statut commande (cf. cadrage V1).
 */
export async function createReturnRequest(input: CreateReturnRequestInput) {
  return withTransaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: input.orderId, storeId: input.storeId },
      select: {
        id: true,
        customerId: true,
        lines: {
          select: { id: true, quantity: true, productName: true, variantName: true, sku: true },
        },
      },
    });

    if (order === null) {
      throw new CreateReturnRequestError("Commande introuvable.");
    }

    if (order.lines.length === 0) {
      throw new CreateReturnRequestError("Commande sans ligne à retourner.");
    }

    const existing = await tx.returnRequest.findFirst({
      where: { orderId: input.orderId, status: { in: [...ACTIVE_RETURN_STATUSES] } },
      select: { id: true },
    });

    if (existing !== null) {
      throw new CreateReturnRequestError("Une demande de retour est déjà en cours.");
    }

    return tx.returnRequest.create({
      data: {
        storeId: input.storeId,
        orderId: input.orderId,
        customerId: order.customerId,
        returnNumber: generateReturnNumber(new Date().getFullYear()),
        status: "REQUESTED",
        requestedAt: new Date(),
        items: {
          create: order.lines.map((line) => ({
            orderLine: { connect: { id: line.id } },
            quantity: line.quantity,
            productName: line.productName,
            variantName: line.variantName,
            sku: line.sku,
          })),
        },
      },
      select: { id: true, returnNumber: true },
    });
  });
}
