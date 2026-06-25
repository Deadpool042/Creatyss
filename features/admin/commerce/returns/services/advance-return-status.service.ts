import "server-only";

import type { Prisma, ReturnRequestStatus } from "@/prisma-generated/client";
import { db } from "@/core/db";
import { withTransaction } from "@/core/db/transactions/with-transaction";
import {
  processStripeRefund,
  ProcessStripeRefundError,
} from "@/features/admin/commerce/returns/services/process-stripe-refund.service";

export class AdvanceReturnError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdvanceReturnError";
  }
}

/** Transitions autorisées V1 (cf. cadrage returns). */
const ALLOWED_TRANSITIONS: Record<ReturnRequestStatus, ReadonlyArray<ReturnRequestStatus>> = {
  REQUESTED: ["UNDER_REVIEW", "APPROVED", "REJECTED", "CANCELLED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["RECEIVED", "CANCELLED"],
  RECEIVED: ["REFUNDED", "CLOSED"],
  REFUNDED: ["CLOSED"],
  REJECTED: [],
  CLOSED: [],
  CANCELLED: [],
  ARCHIVED: [],
};

const TIMESTAMP_FIELD: Partial<Record<ReturnRequestStatus, string>> = {
  APPROVED: "approvedAt",
  REJECTED: "rejectedAt",
  RECEIVED: "receivedAt",
  REFUNDED: "refundedAt",
  CLOSED: "closedAt",
  CANCELLED: "cancelledAt",
};

type AdvanceInput = {
  returnRequestId: string;
  storeId: string;
  nextStatus: ReturnRequestStatus;
};

export async function advanceReturnStatus(input: AdvanceInput) {
  // Lecture préalable hors transaction pour les effets de bord externes (Stripe).
  const request = await db.returnRequest.findFirst({
    where: { id: input.returnRequestId, storeId: input.storeId },
    select: { id: true, status: true, orderId: true },
  });

  if (request === null) {
    throw new AdvanceReturnError("Demande de retour introuvable.");
  }

  if (!ALLOWED_TRANSITIONS[request.status].includes(input.nextStatus)) {
    throw new AdvanceReturnError(
      `Transition ${request.status} → ${input.nextStatus} non autorisée.`
    );
  }

  // Stripe-first : appel externe avant toute écriture DB, uniquement pour les paiements Stripe.
  // Les remboursements par virement sont traités manuellement hors système.
  if (input.nextStatus === "REFUNDED") {
    const payment = await db.payment.findFirst({
      where: { orderId: request.orderId, storeId: input.storeId },
      select: { provider: true },
      orderBy: { createdAt: "desc" },
    });

    if (payment?.provider === "stripe") {
      try {
        await processStripeRefund({
          orderId: request.orderId,
          storeId: input.storeId,
          returnRequestId: request.id,
        });
      } catch (err) {
        if (err instanceof ProcessStripeRefundError) {
          throw new AdvanceReturnError(err.message);
        }
        throw err;
      }
    }
  }

  return withTransaction(async (tx) => {
    const now = new Date();
    const timestampField = TIMESTAMP_FIELD[input.nextStatus];

    if (input.nextStatus === "APPROVED" || input.nextStatus === "REJECTED") {
      await tx.returnDecision.create({
        data: {
          returnRequest: { connect: { id: request.id } },
          type: input.nextStatus === "APPROVED" ? "APPROVE" : "REJECT",
        },
      });
    }

    if (input.nextStatus === "RECEIVED") {
      await restockReturnItems(tx, request.id, input.storeId);
    }

    return tx.returnRequest.update({
      where: { id: request.id },
      data: {
        status: input.nextStatus,
        ...(timestampField ? { [timestampField]: now } : {}),
      },
      select: { id: true, status: true },
    });
  });
}

/** Restock les articles retournés reçus (skip si condition DAMAGED ou variant absent). */
async function restockReturnItems(
  tx: Prisma.TransactionClient,
  returnRequestId: string,
  storeId: string
): Promise<void> {
  const items = await tx.returnItem.findMany({
    where: { returnRequestId },
    select: {
      quantity: true,
      condition: true,
      orderLine: { select: { variantId: true } },
    },
  });

  for (const item of items) {
    if (item.condition === "DAMAGED") continue;
    const variantId = item.orderLine?.variantId ?? null;
    if (variantId === null) continue;

    const inventoryItem = await tx.inventoryItem.findUnique({
      where: { storeId_variantId: { storeId, variantId } },
      select: { id: true },
    });
    if (inventoryItem === null) continue;

    await tx.inventoryItem.update({
      where: { id: inventoryItem.id },
      data: { onHandQuantity: { increment: item.quantity } },
    });

    await tx.inventoryMovement.create({
      data: {
        inventoryItemId: inventoryItem.id,
        type: "RETURN",
        quantityDelta: item.quantity,
        referenceType: "return_request",
        referenceId: returnRequestId,
      },
    });
  }
}
