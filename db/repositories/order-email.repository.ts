import { prisma } from "@/db/prisma-client";
import type { OrderEmailEventType, OrderEmailEventStatus, OrderEmailEvent } from "./order-email.types";
export type { OrderEmailEventType, OrderEmailEventStatus, OrderEmailEvent };

function mapPrismaOrderEmailEvent(row: {
  id: bigint;
  order_id: bigint;
  event_type: string;
  status: string;
  recipient_email: string;
  provider: string;
  provider_message_id: string | null;
  last_error: string | null;
  sent_at: Date | null;
  created_at: Date;
  updated_at: Date;
}): OrderEmailEvent {
  return {
    id: row.id.toString(),
    orderId: row.order_id.toString(),
    eventType: row.event_type as OrderEmailEventType,
    status: row.status as OrderEmailEventStatus,
    recipientEmail: row.recipient_email,
    provider: row.provider as "resend" | "brevo",
    providerMessageId: row.provider_message_id,
    lastError: row.last_error,
    sentAt: row.sent_at !== null ? row.sent_at.toISOString() : null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function createOrderEmailEventIfAbsent(input: {
  orderId: string;
  eventType: OrderEmailEventType;
  recipientEmail: string;
}): Promise<OrderEmailEvent | null> {
  if (!/^[0-9]+$/.test(input.orderId)) {
    return null;
  }

  const results = await prisma.order_email_events.createMany({
    data: [
      {
        order_id: BigInt(input.orderId),
        event_type: input.eventType,
        status: "pending",
        recipient_email: input.recipientEmail,
        provider: "brevo",
      },
    ],
    skipDuplicates: true,
  });

  if (results.count === 0) {
    return null;
  }

  // Fetch the just-created event to return it
  const row = await prisma.order_email_events.findFirst({
    where: {
      order_id: BigInt(input.orderId),
      event_type: input.eventType,
    },
    orderBy: { created_at: "desc" },
  });

  return row !== null ? mapPrismaOrderEmailEvent(row) : null;
}

export async function markOrderEmailEventSent(input: {
  id: string;
  providerMessageId: string | null;
}): Promise<void> {
  if (!/^[0-9]+$/.test(input.id)) {
    return;
  }

  await prisma.order_email_events.update({
    where: { id: BigInt(input.id) },
    data: {
      status: "sent",
      provider_message_id: input.providerMessageId,
      last_error: null,
      sent_at: new Date(),
    },
  });
}

export async function markOrderEmailEventFailed(input: {
  id: string;
  lastError: string;
}): Promise<void> {
  if (!/^[0-9]+$/.test(input.id)) {
    return;
  }

  await prisma.order_email_events.update({
    where: { id: BigInt(input.id) },
    data: {
      status: "failed",
      last_error: input.lastError,
    },
  });
}

export async function listOrderEmailEventsByOrderId(orderId: string): Promise<OrderEmailEvent[]> {
  if (!/^[0-9]+$/.test(orderId)) {
    return [];
  }

  const rows = await prisma.order_email_events.findMany({
    where: { order_id: BigInt(orderId) },
    orderBy: [{ created_at: "asc" }, { id: "asc" }],
  });

  return rows.map(mapPrismaOrderEmailEvent);
}
