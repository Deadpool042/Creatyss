import { db } from "@/core/db";
import type {
  OrderEmailEvent,
  OrderEmailEventType,
  OrderEmailEventStatus,
  OrderEmailEventProvider,
  CreateOrderEmailEventIfAbsentInput,
  MarkOrderEmailEventSentInput,
  MarkOrderEmailEventFailedInput,
} from "@/features/email/order-email.types";
export type { OrderEmailEvent, OrderEmailEventType, OrderEmailEventStatus };

import type { EmailMessage, EmailRecipient } from "@/prisma-generated/client";

type EmailMessageWithRecipients = EmailMessage & { recipients: EmailRecipient[] };

function toAppEmailProvider(provider: string | null): OrderEmailEventProvider {
  if (provider === "mailpit" || provider === "brevo" || provider === "resend") {
    return provider;
  }

  return "brevo";
}

function toAppEmailStatus(status: string): OrderEmailEventStatus {
  if (status === "SENT") return "sent";
  if (status === "FAILED" || status === "CANCELLED") return "failed";
  return "pending";
}

function mapEmailMessage(msg: EmailMessageWithRecipients): OrderEmailEvent {
  const toRecipient = msg.recipients.find((r) => r.type === "TO");
  return {
    id: msg.id,
    orderId: msg.subjectId ?? "",
    eventType: msg.subjectLine as OrderEmailEventType,
    status: toAppEmailStatus(msg.status),
    recipientEmail: toRecipient?.email ?? "",
    provider: toAppEmailProvider(msg.provider),
    providerMessageId: msg.providerReference ?? null,
    lastError: msg.errorMessage ?? null,
    sentAt: msg.sentAt ? msg.sentAt.toISOString() : null,
    createdAt: msg.createdAt.toISOString(),
    updatedAt: msg.updatedAt.toISOString(),
  };
}

export async function createOrderEmailEventIfAbsent(
  input: CreateOrderEmailEventIfAbsentInput
): Promise<OrderEmailEvent | null> {
  if (!input.orderId || input.orderId.trim().length === 0) return null;

  const existing = await db.emailMessage.findFirst({
    where: {
      subjectType: "order",
      subjectId: input.orderId,
      subjectLine: input.eventType,
    },
    include: { recipients: true },
  });
  if (existing) return mapEmailMessage(existing);

  const created = await db.emailMessage.create({
    data: {
      subjectType: "order",
      subjectId: input.orderId,
      subjectLine: input.eventType,
      category: "TRANSACTIONAL",
      status: "PREPARED",
      provider: input.provider,
      recipients: {
        create: { type: "TO", email: input.recipientEmail },
      },
    },
    include: { recipients: true },
  });
  return mapEmailMessage(created);
}

export async function markOrderEmailEventSent(input: MarkOrderEmailEventSentInput): Promise<void> {
  if (!input.id || input.id.trim().length === 0) return;
  await db.emailMessage.update({
    where: { id: input.id },
    data: {
      status: "SENT",
      providerReference: input.providerMessageId,
      errorMessage: null,
      sentAt: new Date(),
    },
  });
}

export async function markOrderEmailEventFailed(
  input: MarkOrderEmailEventFailedInput
): Promise<void> {
  if (!input.id || input.id.trim().length === 0) return;
  await db.emailMessage.update({
    where: { id: input.id },
    data: { status: "FAILED", errorMessage: input.lastError },
  });
}

export async function listOrderEmailEventsByOrderId(orderId: string): Promise<OrderEmailEvent[]> {
  if (!orderId || orderId.trim().length === 0) return [];
  const messages = await db.emailMessage.findMany({
    where: { subjectType: "order", subjectId: orderId },
    include: { recipients: true },
    orderBy: { createdAt: "asc" },
  });
  return messages.map(mapEmailMessage);
}
