import "server-only";

import type { ReturnRequestStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db/transactions/with-transaction";

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
  return withTransaction(async (tx) => {
    const request = await tx.returnRequest.findFirst({
      where: { id: input.returnRequestId, storeId: input.storeId },
      select: { id: true, status: true },
    });

    if (request === null) {
      throw new AdvanceReturnError("Demande de retour introuvable.");
    }

    if (!ALLOWED_TRANSITIONS[request.status].includes(input.nextStatus)) {
      throw new AdvanceReturnError(
        `Transition ${request.status} → ${input.nextStatus} non autorisée.`
      );
    }

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
