import "server-only";

import { withTransaction } from "@/core/db/transactions/with-transaction";

export class CreateFulfillmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateFulfillmentError";
  }
}

type CreateFulfillmentInput = {
  orderId: string;
  storeId: string;
};

/**
 * Crée une préparation (fulfillment) « tout ou rien » pour une commande : un
 * `FulfillmentItem` par ligne (quantité commandée). Une seule préparation active
 * par commande. Ne touche ni au stock ni au statut commande (cf. cadrage V1).
 */
export async function createFulfillment(input: CreateFulfillmentInput) {
  return withTransaction(async (tx) => {
    const order = await tx.order.findFirst({
      where: { id: input.orderId, storeId: input.storeId },
      select: { id: true, lines: { select: { id: true, quantity: true } } },
    });

    if (order === null) {
      throw new CreateFulfillmentError("Commande introuvable.");
    }

    if (order.lines.length === 0) {
      throw new CreateFulfillmentError("Commande sans ligne à préparer.");
    }

    const existing = await tx.fulfillment.findFirst({
      where: {
        orderId: input.orderId,
        status: { notIn: ["CANCELLED", "ARCHIVED"] },
      },
      select: { id: true },
    });

    if (existing !== null) {
      throw new CreateFulfillmentError("Une préparation existe déjà pour cette commande.");
    }

    return tx.fulfillment.create({
      data: {
        storeId: input.storeId,
        orderId: input.orderId,
        status: "PENDING",
        items: {
          create: order.lines.map((line) => ({
            orderLine: { connect: { id: line.id } },
            quantity: line.quantity,
            status: "PENDING",
          })),
        },
      },
      select: { id: true },
    });
  });
}
