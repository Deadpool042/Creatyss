import { db, queryFirst } from "@/db/client";

type TimestampValue = Date | string;
type OrderStatus = "pending" | "paid" | "cancelled";
export type PaymentStatus = "pending" | "succeeded" | "failed";

type PaymentStartContextRow = {
  order_id: string;
  reference: string;
  order_status: OrderStatus;
  customer_email: string;
  total_amount: string;
  payment_status: PaymentStatus;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type PaymentForUpdateRow = {
  order_id: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
};

export type PaymentStartContext = {
  orderId: string;
  reference: string;
  orderStatus: OrderStatus;
  customerEmail: string;
  totalAmount: string;
  paymentStatus: PaymentStatus;
  stripeCheckoutSessionId: string | null;
  stripePaymentIntentId: string | null;
};

function isValidOrderReference(value: string): boolean {
  return /^CRY-[A-Z0-9]{10}$/.test(value);
}

function mapPaymentStartContext(
  row: PaymentStartContextRow
): PaymentStartContext {
  return {
    orderId: row.order_id,
    reference: row.reference,
    orderStatus: row.order_status,
    customerEmail: row.customer_email,
    totalAmount: row.total_amount,
    paymentStatus: row.payment_status,
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id
  };
}

export async function findPaymentStartContextByOrderReference(
  reference: string
): Promise<PaymentStartContext | null> {
  if (!isValidOrderReference(reference)) {
    return null;
  }

  const row = await queryFirst<PaymentStartContextRow>(
    `
      select
        o.id::text as order_id,
        o.reference,
        o.status as order_status,
        o.customer_email,
        o.total_amount::text as total_amount,
        p.status as payment_status,
        p.stripe_checkout_session_id,
        p.stripe_payment_intent_id,
        p.created_at,
        p.updated_at
      from orders o
      inner join payments p on p.order_id = o.id
      where o.reference = $1
      limit 1
    `,
    [reference]
  );

  if (row === null) {
    return null;
  }

  return mapPaymentStartContext(row);
}

export async function saveStripeCheckoutSessionForOrder(input: {
  orderId: string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}): Promise<void> {
  await db.query(
    `
      insert into payments (
        order_id,
        provider,
        method,
        status,
        amount,
        currency,
        stripe_checkout_session_id,
        stripe_payment_intent_id
      )
      select
        o.id,
        'stripe',
        'card',
        'pending',
        o.total_amount,
        'eur',
        $2,
        $3
      from orders o
      where o.id = $1::bigint
      on conflict (order_id) do update
      set
        status = 'pending',
        stripe_checkout_session_id = excluded.stripe_checkout_session_id,
        stripe_payment_intent_id = excluded.stripe_payment_intent_id
    `,
    [
      input.orderId,
      input.stripeCheckoutSessionId,
      input.stripePaymentIntentId
    ]
  );
}

export async function markPaymentSucceededByCheckoutSessionId(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}): Promise<void> {
  const client = await db.connect();

  try {
    await client.query("begin");

    const result = await client.query<PaymentForUpdateRow>(
      `
        select
          p.order_id::text as order_id,
          o.status as order_status,
          p.status as payment_status
        from payments p
        inner join orders o on o.id = p.order_id
        where p.stripe_checkout_session_id = $1
        limit 1
        for update of p, o
      `,
      [input.stripeCheckoutSessionId]
    );
    const row = result.rows[0];

    if (!row) {
      await client.query("commit");
      return;
    }

    if (row.payment_status !== "succeeded") {
      await client.query(
        `
          update payments
          set
            status = 'succeeded',
            stripe_payment_intent_id = coalesce($2, stripe_payment_intent_id)
          where stripe_checkout_session_id = $1
        `,
        [input.stripeCheckoutSessionId, input.stripePaymentIntentId]
      );
    }

    if (row.order_status === "pending") {
      await client.query(
        `
          update orders
          set status = 'paid'
          where id = $1::bigint
        `,
        [row.order_id]
      );
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function markPaymentFailedByCheckoutSessionId(input: {
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
}): Promise<void> {
  const client = await db.connect();

  try {
    await client.query("begin");

    const result = await client.query<PaymentForUpdateRow>(
      `
        select
          p.order_id::text as order_id,
          o.status as order_status,
          p.status as payment_status
        from payments p
        inner join orders o on o.id = p.order_id
        where p.stripe_checkout_session_id = $1
        limit 1
        for update of p, o
      `,
      [input.stripeCheckoutSessionId]
    );
    const row = result.rows[0];

    if (!row) {
      await client.query("commit");
      return;
    }

    if (row.payment_status !== "succeeded") {
      await client.query(
        `
          update payments
          set
            status = 'failed',
            stripe_payment_intent_id = coalesce($2, stripe_payment_intent_id)
          where stripe_checkout_session_id = $1
        `,
        [input.stripeCheckoutSessionId, input.stripePaymentIntentId]
      );
    }

    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
