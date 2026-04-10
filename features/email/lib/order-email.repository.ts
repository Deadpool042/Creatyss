import { db } from "@/core/db";
import type {
  OrderEmailEvent,
  OrderEmailEventType,
  OrderEmailEventStatus,
  CreateOrderEmailEventIfAbsentInput,
  MarkOrderEmailEventSentInput,
  MarkOrderEmailEventFailedInput,
} from "@/features/email/order-email.types";
export type { OrderEmailEvent, OrderEmailEventType, OrderEmailEventStatus };

type TimestampValue = Date | string;

type OrderEmailEventRow = {
  id: string;
  order_id: string;
  event_type: string;
  status: string;
  recipient_email: string;
  provider: string;
  provider_message_id: string | null;
  last_error: string | null;
  sent_at: TimestampValue | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

async function queryFirst<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await db.$queryRawUnsafe<T>(sql, ...params);
  return (rows as T[])[0] ?? null;
}

async function queryRows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return db.$queryRawUnsafe<T[]>(sql, ...params);
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function mapOrderEmailEvent(row: OrderEmailEventRow): OrderEmailEvent {
  return {
    id: row.id,
    orderId: row.order_id,
    eventType: row.event_type as OrderEmailEventType,
    status: row.status as OrderEmailEventStatus,
    recipientEmail: row.recipient_email,
    provider: row.provider as "resend" | "brevo",
    providerMessageId: row.provider_message_id,
    lastError: row.last_error,
    sentAt: row.sent_at !== null ? toIsoTimestamp(row.sent_at) : null,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

export async function createOrderEmailEventIfAbsent(
  input: CreateOrderEmailEventIfAbsentInput
): Promise<OrderEmailEvent | null> {
  if (!/^[0-9]+$/.test(input.orderId)) return null;
  const row = await queryFirst<OrderEmailEventRow>(
    `insert into order_email_events (order_id, event_type, status, recipient_email, provider)
     values ($1::bigint, $2, 'pending', $3, 'brevo')
     on conflict (order_id, event_type) do nothing
     returning id::text as id, order_id::text as order_id, event_type, status,
       recipient_email, provider, provider_message_id, last_error, sent_at, created_at, updated_at`,
    [input.orderId, input.eventType, input.recipientEmail]
  );
  return row ? mapOrderEmailEvent(row) : null;
}

export async function markOrderEmailEventSent(input: MarkOrderEmailEventSentInput): Promise<void> {
  if (!/^[0-9]+$/.test(input.id)) return;
  await db.$executeRawUnsafe(
    `update order_email_events set status = 'sent', provider_message_id = $2, last_error = null,
     sent_at = now() where id = $1::bigint`,
    input.id, input.providerMessageId
  );
}

export async function markOrderEmailEventFailed(
  input: MarkOrderEmailEventFailedInput
): Promise<void> {
  if (!/^[0-9]+$/.test(input.id)) return;
  await db.$executeRawUnsafe(
    `update order_email_events set status = 'failed', last_error = $2 where id = $1::bigint`,
    input.id, input.lastError
  );
}

export async function listOrderEmailEventsByOrderId(orderId: string): Promise<OrderEmailEvent[]> {
  if (!/^[0-9]+$/.test(orderId)) return [];
  const rows = await queryRows<OrderEmailEventRow>(
    `select id::text as id, order_id::text as order_id, event_type, status, recipient_email,
      provider, provider_message_id, last_error, sent_at, created_at, updated_at
     from order_email_events where order_id = $1::bigint
     order by created_at asc, id asc`,
    [orderId]
  );
  return rows.map(mapOrderEmailEvent);
}
