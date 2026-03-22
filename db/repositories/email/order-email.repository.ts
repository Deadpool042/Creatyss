import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import {
  OrderEmailRepositoryError,
  type CreateOrderEmailEventInput,
  type MarkOrderEmailEventFailedInput,
  type MarkOrderEmailEventSentInput,
  type OrderEmailEvent,
} from "./order-email.types";
import { mapOrderEmailEvent } from "./helpers/mappers";
import {
  parseCreateOrderEmailEventInput,
  parseMarkOrderEmailEventFailedInput,
  parseMarkOrderEmailEventSentInput,
} from "./helpers/validation";
import {
  findOrderEmailEventRowById,
  listOrderEmailEventRowsByOrderId,
} from "./queries/order-email.queries";

async function ensureOrderExists(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true },
  });

  if (!order) {
    throw new OrderEmailRepositoryError("order_email_order_not_found", "Commande introuvable.");
  }
}

async function ensureEmailTemplateExists(emailTemplateId: string): Promise<void> {
  const emailTemplate = await prisma.emailTemplate.findUnique({
    where: { id: emailTemplateId },
    select: { id: true },
  });

  if (!emailTemplate) {
    throw new OrderEmailRepositoryError(
      "order_email_template_invalid",
      "Template email introuvable."
    );
  }
}

export async function findOrderEmailEventById(id: string): Promise<OrderEmailEvent | null> {
  const row = await findOrderEmailEventRowById(id);

  if (!row) {
    return null;
  }

  return mapOrderEmailEvent(row);
}

export async function listOrderEmailEventsByOrderId(orderId: string): Promise<OrderEmailEvent[]> {
  await ensureOrderExists(orderId);

  const rows = await listOrderEmailEventRowsByOrderId(orderId);
  return rows.map(mapOrderEmailEvent);
}

export async function createOrderEmailEvent(
  input: CreateOrderEmailEventInput
): Promise<OrderEmailEvent> {
  const parsedInput = parseCreateOrderEmailEventInput(input);

  await ensureOrderExists(parsedInput.orderId);

  if (parsedInput.emailTemplateId) {
    await ensureEmailTemplateExists(parsedInput.emailTemplateId);
  }

  const created = await prisma.orderEmailEvent.create({
    data: {
      orderId: parsedInput.orderId,
      emailTemplateId: parsedInput.emailTemplateId ?? null,
      templateKey: parsedInput.templateKey,
      recipientEmail: parsedInput.recipientEmail,
      subject: parsedInput.subject,
      status: "pending",
      provider: parsedInput.provider ?? null,
      payloadJson:
        parsedInput.payloadJson === undefined
          ? Prisma.JsonNull
          : (parsedInput.payloadJson as Prisma.InputJsonValue),
    },
    select: {
      id: true,
    },
  });

  const row = await findOrderEmailEventRowById(created.id);

  if (!row) {
    throw new OrderEmailRepositoryError(
      "order_email_event_not_found",
      "Événement email introuvable."
    );
  }

  return mapOrderEmailEvent(row);
}

export async function markOrderEmailEventSent(
  input: MarkOrderEmailEventSentInput
): Promise<OrderEmailEvent | null> {
  const parsedInput = parseMarkOrderEmailEventSentInput(input);

  const updated = await prisma.orderEmailEvent.updateMany({
    where: {
      id: parsedInput.id,
    },
    data: {
      status: "sent",
      provider: parsedInput.provider ?? null,
      providerMessageId: parsedInput.providerMessageId ?? null,
      sentAt: parsedInput.sentAt ?? new Date(),
      lastError: null,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findOrderEmailEventRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapOrderEmailEvent(row);
}

export async function markOrderEmailEventFailed(
  input: MarkOrderEmailEventFailedInput
): Promise<OrderEmailEvent | null> {
  const parsedInput = parseMarkOrderEmailEventFailedInput(input);

  const updated = await prisma.orderEmailEvent.updateMany({
    where: {
      id: parsedInput.id,
    },
    data: {
      status: "failed",
      provider: parsedInput.provider ?? null,
      lastError: parsedInput.lastError,
    },
  });

  if (updated.count === 0) {
    return null;
  }

  const row = await findOrderEmailEventRowById(parsedInput.id);

  if (!row) {
    return null;
  }

  return mapOrderEmailEvent(row);
}
