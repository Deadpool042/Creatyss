import "server-only";

import type { FulfillmentStatus, Prisma } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db/transactions/with-transaction";

async function decrementInventoryForFulfillment(
  tx: Prisma.TransactionClient,
  fulfillmentId: string,
  storeId: string
): Promise<void> {
  const items = await tx.fulfillmentItem.findMany({
    where: { fulfillmentId },
    select: { quantity: true, orderLine: { select: { variantId: true } } },
  });

  for (const item of items) {
    const variantId = item.orderLine.variantId;
    if (variantId === null) continue;

    const inventoryItem = await tx.inventoryItem.findUnique({
      where: { storeId_variantId: { storeId, variantId } },
      select: { id: true },
    });
    if (inventoryItem === null) continue;

    await tx.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: { onHandQuantity: { decrement: item.quantity } },
    });

    await tx.inventoryMovement.create({
      data: {
        inventoryItemId: inventoryItem.id,
        type: "CONSUMPTION",
        quantityDelta: -item.quantity,
        referenceType: "fulfillment",
        referenceId: fulfillmentId,
      },
    });
  }
}

export class AdvanceFulfillmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdvanceFulfillmentError";
  }
}

/** Transitions autorisées V1 (cf. cadrage fulfillment D4). */
const ALLOWED_TRANSITIONS: Record<FulfillmentStatus, ReadonlyArray<FulfillmentStatus>> = {
  PENDING: ["READY", "FULFILLED", "CANCELLED"],
  READY: ["FULFILLED", "CANCELLED"],
  PARTIALLY_FULFILLED: ["FULFILLED", "CANCELLED"],
  FULFILLED: [],
  CANCELLED: [],
  ARCHIVED: [],
};

type AdvanceInput = {
  fulfillmentId: string;
  storeId: string;
  nextStatus: FulfillmentStatus;
};

export async function advanceFulfillmentStatus(input: AdvanceInput) {
  return withTransaction(async (tx) => {
    const fulfillment = await tx.fulfillment.findFirst({
      where: { id: input.fulfillmentId, storeId: input.storeId },
      select: { id: true, status: true },
    });

    if (fulfillment === null) {
      throw new AdvanceFulfillmentError("Préparation introuvable.");
    }

    if (!ALLOWED_TRANSITIONS[fulfillment.status].includes(input.nextStatus)) {
      throw new AdvanceFulfillmentError(
        `Transition ${fulfillment.status} → ${input.nextStatus} non autorisée.`
      );
    }

    const now = new Date();
    const isFulfilled = input.nextStatus === "FULFILLED";
    const isCancelled = input.nextStatus === "CANCELLED";

    if (isFulfilled || isCancelled) {
      await tx.fulfillmentItem.updateMany({
        where: { fulfillmentId: fulfillment.id },
        data: {
          status: isFulfilled ? "FULFILLED" : "CANCELLED",
          ...(isFulfilled ? { fulfilledAt: now } : { cancelledAt: now }),
        },
      });
    }

    if (isFulfilled) {
      await decrementInventoryForFulfillment(tx, fulfillment.id, input.storeId);
    }

    return tx.fulfillment.update({
      where: { id: fulfillment.id },
      data: {
        status: input.nextStatus,
        ...(isFulfilled ? { fulfilledAt: now } : {}),
        ...(isCancelled ? { cancelledAt: now } : {}),
      },
      select: { id: true, status: true },
    });
  });
}
