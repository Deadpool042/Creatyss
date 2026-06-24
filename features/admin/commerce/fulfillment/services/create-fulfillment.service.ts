import "server-only";

import { withTransaction } from "@/core/db/transactions/with-transaction";

export class CreateFulfillmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreateFulfillmentError";
  }
}

type FulfillmentLineInput = {
  orderLineId: string;
  quantity: number;
};

type CreateFulfillmentInput = {
  orderId: string;
  storeId: string;
  /** Lignes à préparer avec leurs quantités. Si absent → tout ou rien (V1). */
  lines?: ReadonlyArray<FulfillmentLineInput>;
  /** Expédition à lier (optionnel). */
  shipmentId?: string;
};

/**
 * Crée une préparation pour une commande. En mode partiel, seules les lignes
 * fournies sont incluses avec les quantités spécifiées (≤ quantité commandée).
 * Une seule préparation active par commande. Ne touche pas au stock (cf. advance).
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

    const lineMap = new Map(order.lines.map((l) => [l.id, l.quantity]));

    let itemsToCreate: ReadonlyArray<FulfillmentLineInput>;

    if (input.lines !== undefined && input.lines.length > 0) {
      for (const item of input.lines) {
        const maxQty = lineMap.get(item.orderLineId);
        if (maxQty === undefined) {
          throw new CreateFulfillmentError(`Ligne introuvable : ${item.orderLineId}.`);
        }
        if (item.quantity <= 0 || item.quantity > maxQty) {
          throw new CreateFulfillmentError(
            `Quantité invalide pour la ligne ${item.orderLineId} (max ${maxQty}).`
          );
        }
      }
      itemsToCreate = input.lines;
    } else {
      itemsToCreate = order.lines.map((l) => ({ orderLineId: l.id, quantity: l.quantity }));
    }

    return tx.fulfillment.create({
      data: {
        storeId: input.storeId,
        orderId: input.orderId,
        status: "PENDING",
        ...(input.shipmentId ? { shipmentId: input.shipmentId } : {}),
        items: {
          create: itemsToCreate.map((item) => ({
            orderLine: { connect: { id: item.orderLineId } },
            quantity: item.quantity,
            status: "PENDING",
          })),
        },
      },
      select: { id: true },
    });
  });
}
