import type { CurrencyCode, Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  mapPaymentMethodKindToPrisma,
  mapPaymentRecord,
  mapPaymentStatusToPrisma,
  normalizePaymentAmount,
} from "@db-payments/helpers/mappers";
import {
  parseCreatePaymentInput,
  parseFailPaymentInput,
  parseProviderPaymentRefsInput,
} from "@db-payments/helpers/validation";
import {
  findPaymentRowById,
  listPaymentRowsByOrderId,
} from "@db-payments/queries/payment.queries";
import type {
  CreatePaymentInput,
  FailPaymentInput,
  PaymentRecord,
  ProviderPaymentRefsInput,
} from "@db-payments/core/types/payment.types";

export async function listPaymentsByOrderId(orderId: string): Promise<PaymentRecord[]> {
  const rows = await listPaymentRowsByOrderId(orderId.trim());
  return rows.map(mapPaymentRecord);
}

export async function findPaymentById(id: string): Promise<PaymentRecord | null> {
  const row = await findPaymentRowById(id.trim());
  return row ? mapPaymentRecord(row) : null;
}

export async function createPayment(input: CreatePaymentInput): Promise<PaymentRecord> {
  const parsedInput = parseCreatePaymentInput(input);

  const created = await prisma.payment.create({
    data: {
      orderId: parsedInput.orderId,
      status: mapPaymentStatusToPrisma("pending"),
      methodKind: mapPaymentMethodKindToPrisma(parsedInput.methodKind),
      amount: normalizePaymentAmount(parsedInput.amount),
      currencyCode: parsedInput.currencyCode as CurrencyCode,
      providerName: parsedInput.providerName ?? null,
      providerReference: parsedInput.providerReference ?? null,
      providerPaymentIntentRef: parsedInput.providerPaymentIntentRef ?? null,
    },
    select: {
      id: true,
    },
  });

  const row = await findPaymentRowById(created.id);

  if (!row) {
    throw new Error("Payment not found after create.");
  }

  return mapPaymentRecord(row);
}

export async function authorizePayment(
  id: string,
  refs?: ProviderPaymentRefsInput
): Promise<PaymentRecord | null> {
  const parsedRefs = refs ? parseProviderPaymentRefsInput(refs) : undefined;
  const data: Prisma.PaymentUncheckedUpdateInput = {
    status: mapPaymentStatusToPrisma("authorized"),
    authorizedAt: new Date(),
  };

  if (parsedRefs?.providerName !== undefined) {
    data.providerName = parsedRefs.providerName;
  }

  if (parsedRefs?.providerReference !== undefined) {
    data.providerReference = parsedRefs.providerReference;
  }

  if (parsedRefs?.providerPaymentIntentRef !== undefined) {
    data.providerPaymentIntentRef = parsedRefs.providerPaymentIntentRef;
  }

  const updated = await prisma.payment.updateMany({
    where: {
      id: id.trim(),
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findPaymentRowById(id.trim());
  return row ? mapPaymentRecord(row) : null;
}

export async function capturePayment(
  id: string,
  refs?: ProviderPaymentRefsInput
): Promise<PaymentRecord | null> {
  const parsedRefs = refs ? parseProviderPaymentRefsInput(refs) : undefined;
  const data: Prisma.PaymentUncheckedUpdateInput = {
    status: mapPaymentStatusToPrisma("captured"),
    capturedAt: new Date(),
  };

  if (parsedRefs?.providerName !== undefined) {
    data.providerName = parsedRefs.providerName;
  }

  if (parsedRefs?.providerReference !== undefined) {
    data.providerReference = parsedRefs.providerReference;
  }

  if (parsedRefs?.providerPaymentIntentRef !== undefined) {
    data.providerPaymentIntentRef = parsedRefs.providerPaymentIntentRef;
  }

  const updated = await prisma.payment.updateMany({
    where: {
      id: id.trim(),
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findPaymentRowById(id.trim());
  return row ? mapPaymentRecord(row) : null;
}

export async function failPayment(
  id: string,
  input: FailPaymentInput
): Promise<PaymentRecord | null> {
  const parsedInput = parseFailPaymentInput(input);
  const data: Prisma.PaymentUncheckedUpdateManyInput = {
    status: mapPaymentStatusToPrisma("failed"),
    failedAt: new Date(),
    failureCode: parsedInput.failureCode,
    failureMessage: parsedInput.failureMessage,
  };

  if (parsedInput.providerName !== undefined) {
    data.providerName = parsedInput.providerName;
  }

  if (parsedInput.providerReference !== undefined) {
    data.providerReference = parsedInput.providerReference;
  }

  if (parsedInput.providerPaymentIntentRef !== undefined) {
    data.providerPaymentIntentRef = parsedInput.providerPaymentIntentRef;
  }

  const updated = await prisma.payment.updateMany({
    where: {
      id: id.trim(),
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findPaymentRowById(id.trim());
  return row ? mapPaymentRecord(row) : null;
}

export async function cancelPayment(
  id: string,
  refs?: ProviderPaymentRefsInput
): Promise<PaymentRecord | null> {
  const parsedRefs = refs ? parseProviderPaymentRefsInput(refs) : undefined;
  const data: Prisma.PaymentUncheckedUpdateManyInput = {
    status: mapPaymentStatusToPrisma("cancelled"),
    cancelledAt: new Date(),
  };

  if (parsedRefs?.providerName !== undefined) {
    data.providerName = parsedRefs.providerName;
  }

  if (parsedRefs?.providerReference !== undefined) {
    data.providerReference = parsedRefs.providerReference;
  }

  if (parsedRefs?.providerPaymentIntentRef !== undefined) {
    data.providerPaymentIntentRef = parsedRefs.providerPaymentIntentRef;
  }

  const updated = await prisma.payment.updateMany({
    where: {
      id: id.trim(),
    },
    data,
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findPaymentRowById(id.trim());
  return row ? mapPaymentRecord(row) : null;
}

export async function refundPayment(
  id: string,
  partial = false
): Promise<PaymentRecord | null> {
  const updated = await prisma.payment.updateMany({
    where: {
      id: id.trim(),
    },
    data: {
      status: mapPaymentStatusToPrisma(partial ? "partially_refunded" : "refunded"),
      refundedAt: new Date(),
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findPaymentRowById(id.trim());
  return row ? mapPaymentRecord(row) : null;
}
