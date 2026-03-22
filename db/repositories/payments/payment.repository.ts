import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  PaymentRepositoryError,
  type CreatePaymentInput,
  type MarkPaymentFailedInput,
  type MarkPaymentPaidInput,
  type Payment,
  type PaymentStatus,
} from "./payment.types";
import { mapPayment } from "./helpers/mappers";
import {
  parseCreatePaymentInput,
  parseMarkPaymentFailedInput,
  parseMarkPaymentPaidInput,
} from "./helpers/validation";
import { findPaymentRowById, listPaymentRowsByOrderId } from "./queries/payment.queries";

async function ensureOrderExists(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!order) {
    throw new PaymentRepositoryError("payment_order_not_found", "Commande introuvable.");
  }
}

function mapPrismaPaymentError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new PaymentRepositoryError(
      "payment_not_found",
      "Conflit sur les identifiants de paiement."
    );
  }

  throw error;
}

export async function findPaymentById(id: string): Promise<Payment | null> {
  const row = await findPaymentRowById(id);

  if (!row) {
    return null;
  }

  return mapPayment(row);
}

export async function listPaymentsByOrderId(orderId: string): Promise<Payment[]> {
  await ensureOrderExists(orderId);

  const rows = await listPaymentRowsByOrderId(orderId);
  return rows.map(mapPayment);
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const parsedInput = parseCreatePaymentInput(input);

  await ensureOrderExists(parsedInput.orderId);

  try {
    const created = await prisma.payment.create({
      data: {
        orderId: parsedInput.orderId,
        provider: parsedInput.provider,
        method: parsedInput.method,
        status: "pending",
        currency: parsedInput.currency,
        amountCents: parsedInput.amountCents,
        providerPaymentId: parsedInput.providerPaymentId ?? null,
        providerIntentId: parsedInput.providerIntentId ?? null,
        providerCheckoutId: parsedInput.providerCheckoutId ?? null,
        metadataJson:
          parsedInput.metadataJson === undefined
            ? Prisma.JsonNull
            : (parsedInput.metadataJson as Prisma.InputJsonValue),
      },
      select: {
        id: true,
      },
    });

    const row = await findPaymentRowById(created.id);

    if (!row) {
      throw new PaymentRepositoryError("payment_not_found", "Paiement introuvable.");
    }

    return mapPayment(row);
  } catch (error) {
    mapPrismaPaymentError(error);
  }
}

export async function markPaymentPaid(input: MarkPaymentPaidInput): Promise<Payment | null> {
  const parsedInput = parseMarkPaymentPaidInput(input);

  const data: {
    status: PaymentStatus;
    providerPaymentId?: string | null;
    providerIntentId?: string | null;
    providerCheckoutId?: string | null;
    paidAt: Date;
    failedAt: null;
    failureCode: null;
    failureReason: null;
  } = {
    status: "paid",
    paidAt: parsedInput.paidAt ?? new Date(),
    failedAt: null,
    failureCode: null,
    failureReason: null,
  };

  if (parsedInput.providerPaymentId !== undefined) {
    data.providerPaymentId = parsedInput.providerPaymentId;
  }

  if (parsedInput.providerIntentId !== undefined) {
    data.providerIntentId = parsedInput.providerIntentId;
  }

  if (parsedInput.providerCheckoutId !== undefined) {
    data.providerCheckoutId = parsedInput.providerCheckoutId;
  }

  const updated = await prisma.payment.updateMany({
    where: {
      id: parsedInput.id,
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findPaymentRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapPayment(row);
}

export async function markPaymentFailed(input: MarkPaymentFailedInput): Promise<Payment | null> {
  const parsedInput = parseMarkPaymentFailedInput(input);

  const data: {
    status: PaymentStatus;
    failureReason: string;
    failureCode?: string | null;
    failedAt: Date;
  } = {
    status: "failed",
    failureReason: parsedInput.failureReason,
    failedAt: parsedInput.failedAt ?? new Date(),
  };

  if (parsedInput.failureCode !== undefined) {
    data.failureCode = parsedInput.failureCode;
  }

  const updated = await prisma.payment.updateMany({
    where: {
      id: parsedInput.id,
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findPaymentRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapPayment(row);
}

export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
): Promise<PaymentStatus | null> {
  const updated = await prisma.payment.updateMany({
    where: { id },
    data: { status },
  });

  if (updated.count === 0) {
    return null;
  }

  return status;
}
