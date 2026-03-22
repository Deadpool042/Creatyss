import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";

import { mapRefund } from "./helpers/mappers";
import {
  parseCreateRefundInput,
  parseMarkRefundFailedInput,
  parseMarkRefundSucceededInput,
} from "./helpers/validation";
import { findRefundRowById, listRefundRowsByOrderId } from "./queries/refund.queries";
import {
  RefundRepositoryError,
  type CreateRefundInput,
  type MarkRefundFailedInput,
  type MarkRefundSucceededInput,
  type Refund,
  type RefundStatus,
} from "./refund.types";

async function ensureOrderExists(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!order) {
    throw new RefundRepositoryError("refund_order_not_found", "Commande introuvable.");
  }
}

async function ensurePaymentExists(paymentId: string): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    select: { id: true },
  });

  if (!payment) {
    throw new RefundRepositoryError("refund_payment_invalid", "Paiement introuvable.");
  }
}

function mapPrismaRefundError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new RefundRepositoryError(
      "refund_not_found",
      "Conflit sur les identifiants de remboursement."
    );
  }

  throw error;
}

export async function findRefundById(id: string): Promise<Refund | null> {
  const row = await findRefundRowById(id);

  if (!row) {
    return null;
  }

  return mapRefund(row);
}

export async function listRefundsByOrderId(orderId: string): Promise<Refund[]> {
  await ensureOrderExists(orderId);

  const rows = await listRefundRowsByOrderId(orderId);
  return rows.map(mapRefund);
}

export async function createRefund(input: CreateRefundInput): Promise<Refund> {
  const parsedInput = parseCreateRefundInput(input);

  await ensureOrderExists(parsedInput.orderId);

  if (parsedInput.paymentId) {
    await ensurePaymentExists(parsedInput.paymentId);
  }

  try {
    const created = await prisma.refund.create({
      data: {
        orderId: parsedInput.orderId,
        paymentId: parsedInput.paymentId ?? null,
        status: "pending",
        amountCents: parsedInput.amountCents,
        reason: parsedInput.reason ?? null,
        providerRefundId: parsedInput.providerRefundId ?? null,
      },
      select: {
        id: true,
      },
    });

    const row = await findRefundRowById(created.id);

    if (!row) {
      throw new RefundRepositoryError("refund_not_found", "Remboursement introuvable.");
    }

    return mapRefund(row);
  } catch (error) {
    mapPrismaRefundError(error);
  }
}

export async function markRefundSucceeded(input: MarkRefundSucceededInput): Promise<Refund | null> {
  const parsedInput = parseMarkRefundSucceededInput(input);

  const data: {
    status: RefundStatus;
    providerRefundId?: string | null;
    processedAt: Date;
    failureReason: null;
  } = {
    status: "succeeded",
    processedAt: parsedInput.processedAt ?? new Date(),
    failureReason: null,
  };

  if (parsedInput.providerRefundId !== undefined) {
    data.providerRefundId = parsedInput.providerRefundId;
  }

  const updated = await prisma.refund.updateMany({
    where: {
      id: parsedInput.id,
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findRefundRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapRefund(row);
}

export async function markRefundFailed(input: MarkRefundFailedInput): Promise<Refund | null> {
  const parsedInput = parseMarkRefundFailedInput(input);

  const updated = await prisma.refund.updateMany({
    where: {
      id: parsedInput.id,
    },
    data: {
      status: "failed",
      failureReason: parsedInput.failureReason,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findRefundRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapRefund(row);
}

export async function updateRefundStatus(
  id: string,
  status: RefundStatus
): Promise<RefundStatus | null> {
  const updated = await prisma.refund.updateMany({
    where: { id },
    data: { status },
  });

  if (updated.count === 0) {
    return null;
  }

  return status;
}
