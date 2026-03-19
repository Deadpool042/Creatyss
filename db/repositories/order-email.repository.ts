import { queryFirst, queryRows } from "@/db/client";

export type OrderEmailEventType = "order_created" | "payment_succeeded" | "order_shipped";

export type OrderEmailEventStatus = "pending" | "sent" | "failed";

type TimestampValue = Date | string;

type OrderEmailEventRow = {
  id: string;
  order_id: string;
  event_type: OrderEmailEventType;
  status: OrderEmailEventStatus;
  recipient_email: string;
  provider: "resend" | "brevo";
  provider_message_id: string | null;
  last_error: string | null;
  sent_at: TimestampValue | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

export type OrderEmailEvent = {
  id: string;
  orderId: string;
  eventType: OrderEmailEventType;
  status: OrderEmailEventStatus;
  recipientEmail: string;
  provider: "resend" | "brevo";
  providerMessageId: string | null;
  lastError: string | null;
  sentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapOrderEmailEvent(row: OrderEmailEventRow): OrderEmailEvent {
  return {
    id: row.id,
    orderId: row.order_id,
    eventType: row.event_type,
    status: row.status,
    recipientEmail: row.recipient_email,
    provider: row.provider,
    providerMessageId: row.provider_message_id,
    lastError: row.last_error,
    sentAt: row.sent_at ? toIsoTimestamp(row.sent_at) : null,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

export async function createOrderEmailEventIfAbsent(input: {
  orderId: string;
  eventType: OrderEmailEventType;
  recipientEmail: string;
}): Promise<OrderEmailEvent | null> {
  if (!isValidNumericId(input.orderId)) {
    return null;
  }

  const row = await queryFirst<OrderEmailEventRow>(
    `
      insert into order_email_events (
        order_id,
        event_type,
        status,
        recipient_email,
        provider
      )
      values (
        $1::bigint,
        $2,
        'pending',
        $3,
        'brevo'
      )
      on conflict (order_id, event_type) do nothing
      returning
        id::text as id,
        order_id::text as order_id,
        event_type,
        status,
        recipient_email,
        provider,
        provider_message_id,
        last_error,
        sent_at,
        created_at,
        updated_at
    `,
    [input.orderId, input.eventType, input.recipientEmail]
  );

  return row ? mapOrderEmailEvent(row) : null;
}

export async function markOrderEmailEventSent(input: {
  id: string;
  providerMessageId: string | null;
}): Promise<void> {
  if (!isValidNumericId(input.id)) {
    return;
  }

  await queryFirst(
    `
      update order_email_events
      set
        status = 'sent',
        provider_message_id = $2,
        last_error = null,
        sent_at = now()
      where id = $1::bigint
      returning id
    `,
    [input.id, input.providerMessageId]
  );
}

export async function markOrderEmailEventFailed(input: {
  id: string;
  lastError: string;
}): Promise<void> {
  if (!isValidNumericId(input.id)) {
    return;
  }

  await queryFirst(
    `
      update order_email_events
      set
        status = 'failed',
        last_error = $2
      where id = $1::bigint
      returning id
    `,
    [input.id, input.lastError]
  );
}

export async function listOrderEmailEventsByOrderId(orderId: string): Promise<OrderEmailEvent[]> {
  if (!isValidNumericId(orderId)) {
    return [];
  }

  const rows = await queryRows<OrderEmailEventRow>(
    `
      select
        id::text as id,
        order_id::text as order_id,
        event_type,
        status,
        recipient_email,
        provider,
        provider_message_id,
        last_error,
        sent_at,
        created_at,
        updated_at
      from order_email_events
      where order_id = $1::bigint
      order by created_at asc, id asc
    `,
    [orderId]
  );

  return rows.map(mapOrderEmailEvent);
}
