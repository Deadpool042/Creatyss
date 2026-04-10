import { db } from "@/core/db";
import { normalizeMoneyString, moneyStringToCents, centsToMoneyString } from "@/core/money";
import { listOrderEmailEventsByOrderId } from "@/features/email/lib/order-email.repository";
import { createOrderReference } from "@/entities/order/order-reference";
import { resolveOrderStatusTransition } from "@/entities/order/order-status-transition";
import {
  OrderRepositoryError,
  type OrderStatus,
  type PaymentStatus,
  type PaymentProvider,
  type PaymentMethod,
  type OrderLine,
  type OrderPayment,
  type PublicOrderConfirmation,
  type AdminOrderSummary,
  type OrderEmailContext,
  type AdminOrderDetail,
} from "./order.types";
export {
  OrderRepositoryError,
  type OrderStatus,
  type PaymentStatus,
  type PaymentProvider,
  type PaymentMethod,
  type OrderLine,
  type OrderPayment,
  type PublicOrderConfirmation,
  type AdminOrderSummary,
  type OrderEmailContext,
  type AdminOrderDetail,
};

type TimestampValue = Date | string;
type ProductStatus = "draft" | "published";
type ProductVariantStatus = "draft" | "published";

type CartIdRow = { id: string };
type CheckoutDraftRow = {
  id: string; customer_email: string | null; customer_first_name: string | null;
  customer_last_name: string | null; customer_phone: string | null;
  shipping_address_line_1: string | null; shipping_address_line_2: string | null;
  shipping_postal_code: string | null; shipping_city: string | null;
  shipping_country_code: string | null; billing_same_as_shipping: boolean;
  billing_first_name: string | null; billing_last_name: string | null;
  billing_phone: string | null; billing_address_line_1: string | null;
  billing_address_line_2: string | null; billing_postal_code: string | null;
  billing_city: string | null; billing_country_code: string | null;
};
type OrderSourceLineRow = {
  cart_item_id: string; product_variant_id: string; quantity: number;
  product_name: string; product_status: ProductStatus; variant_name: string;
  variant_status: ProductVariantStatus; color_name: string; color_hex: string | null;
  sku: string; unit_price: string; stock_quantity: number;
};
type OrderRow = {
  id: string; reference: string; status: OrderStatus; customer_email: string;
  customer_first_name: string; customer_last_name: string; customer_phone: string | null;
  shipping_address_line_1: string; shipping_address_line_2: string | null;
  shipping_postal_code: string; shipping_city: string; shipping_country_code: string;
  billing_same_as_shipping: boolean; billing_first_name: string | null;
  billing_last_name: string | null; billing_phone: string | null;
  billing_address_line_1: string | null; billing_address_line_2: string | null;
  billing_postal_code: string | null; billing_city: string | null;
  billing_country_code: string | null; shipped_at: TimestampValue | null;
  tracking_reference: string | null; total_amount: string;
  payment_status: PaymentStatus | null; payment_provider: PaymentProvider | null;
  payment_method: PaymentMethod | null; payment_amount: string | null;
  payment_currency: string | null; stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null; created_at: TimestampValue; updated_at: TimestampValue;
};
type OrderItemRow = {
  id: string; order_id: string; source_product_variant_id: string | null;
  product_name: string; variant_name: string; color_name: string; color_hex: string | null;
  sku: string; unit_price: string; quantity: number; line_total: string; created_at: TimestampValue;
};
type OrderSummaryRow = {
  id: string; reference: string; status: OrderStatus; payment_status: PaymentStatus | null;
  customer_email: string; customer_first_name: string; customer_last_name: string;
  total_amount: string; line_count: number; created_at: TimestampValue; updated_at: TimestampValue;
};
type OrderEmailContextRow = {
  id: string; reference: string; customer_email: string; customer_first_name: string;
  total_amount: string; tracking_reference: string | null;
};
type CreatedOrderRow = { id: string; reference: string };
type OrderStatusRow = { id: string; status: OrderStatus };
type PostgreSqlErrorLike = Error & { code: string; constraint?: string };

async function queryFirst<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await db.$queryRawUnsafe<T>(sql, ...params);
  return (rows as T[])[0] ?? null;
}

async function queryRows<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  return db.$queryRawUnsafe<T[]>(sql, ...params);
}

function isValidNumericId(value: string): boolean { return /^[0-9]+$/.test(value); }
function isValidOrderReference(value: string): boolean { return /^CRY-[A-Z0-9]{10}$/.test(value); }

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  if (!(error instanceof Error)) return false;
  return typeof (error as PostgreSqlErrorLike).code === "string";
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(value).toISOString();
}

function checkoutDraftIsComplete(row: CheckoutDraftRow | null): row is CheckoutDraftRow {
  if (row === null) return false;
  if (
    row.customer_email === null || row.customer_first_name === null ||
    row.customer_last_name === null || row.shipping_address_line_1 === null ||
    row.shipping_postal_code === null || row.shipping_city === null ||
    row.shipping_country_code !== "FR"
  ) return false;
  if (row.billing_same_as_shipping) return true;
  return (
    row.billing_first_name !== null && row.billing_last_name !== null &&
    row.billing_address_line_1 !== null && row.billing_postal_code !== null &&
    row.billing_city !== null && row.billing_country_code === "FR"
  );
}

function sourceLineIsAvailable(row: OrderSourceLineRow): boolean {
  return (
    row.product_status === "published" && row.variant_status === "published" &&
    row.stock_quantity >= row.quantity && row.stock_quantity > 0
  );
}

function mapOrderPayment(row: OrderRow): OrderPayment {
  return {
    status: row.payment_status ?? "pending",
    provider: row.payment_provider ?? "stripe",
    method: row.payment_method ?? "card",
    amount: normalizeMoneyString(row.payment_amount ?? row.total_amount),
    currency: (row.payment_currency ?? "eur") as "eur",
    stripeCheckoutSessionId: row.stripe_checkout_session_id,
    stripePaymentIntentId: row.stripe_payment_intent_id,
  };
}

function mapOrderLine(row: OrderItemRow): OrderLine {
  return {
    id: row.id, sourceProductVariantId: row.source_product_variant_id,
    productName: row.product_name, variantName: row.variant_name, colorName: row.color_name,
    colorHex: row.color_hex, sku: row.sku, unitPrice: normalizeMoneyString(row.unit_price),
    quantity: row.quantity, lineTotal: normalizeMoneyString(row.line_total),
    createdAt: toIsoTimestamp(row.created_at),
  };
}

function mapOrderRow(row: OrderRow, lines: OrderItemRow[]): PublicOrderConfirmation {
  return {
    id: row.id, reference: row.reference, status: row.status,
    customerEmail: row.customer_email, customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name, customerPhone: row.customer_phone,
    shippingAddressLine1: row.shipping_address_line_1, shippingAddressLine2: row.shipping_address_line_2,
    shippingPostalCode: row.shipping_postal_code, shippingCity: row.shipping_city,
    shippingCountryCode: row.shipping_country_code as "FR",
    billingSameAsShipping: row.billing_same_as_shipping, billingFirstName: row.billing_first_name,
    billingLastName: row.billing_last_name, billingPhone: row.billing_phone,
    billingAddressLine1: row.billing_address_line_1, billingAddressLine2: row.billing_address_line_2,
    billingPostalCode: row.billing_postal_code, billingCity: row.billing_city,
    billingCountryCode: row.billing_country_code as "FR" | null,
    shippedAt: row.shipped_at ? toIsoTimestamp(row.shipped_at) : null,
    trackingReference: row.tracking_reference, totalAmount: normalizeMoneyString(row.total_amount),
    payment: mapOrderPayment(row), createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at), lines: lines.map(mapOrderLine),
  };
}

function mapAdminOrderSummary(row: OrderSummaryRow): AdminOrderSummary {
  return {
    id: row.id, reference: row.reference, status: row.status,
    paymentStatus: row.payment_status ?? "pending", customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name, customerLastName: row.customer_last_name,
    totalAmount: normalizeMoneyString(row.total_amount), lineCount: row.line_count,
    createdAt: toIsoTimestamp(row.created_at), updatedAt: toIsoTimestamp(row.updated_at),
  };
}

function mapOrderEmailContext(row: OrderEmailContextRow): OrderEmailContext {
  return {
    id: row.id, reference: row.reference, customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    totalAmount: normalizeMoneyString(row.total_amount), trackingReference: row.tracking_reference,
  };
}

const ORDER_WITH_PAYMENT_SELECT = `
  select o.id::text as id, o.reference, o.status, o.customer_email, o.customer_first_name,
    o.customer_last_name, o.customer_phone, o.shipping_address_line_1, o.shipping_address_line_2,
    o.shipping_postal_code, o.shipping_city, o.shipping_country_code, o.billing_same_as_shipping,
    o.billing_first_name, o.billing_last_name, o.billing_phone, o.billing_address_line_1,
    o.billing_address_line_2, o.billing_postal_code, o.billing_city, o.billing_country_code,
    o.shipped_at, o.tracking_reference, o.total_amount::text as total_amount,
    p.status as payment_status, p.provider as payment_provider, p.method as payment_method,
    p.amount::text as payment_amount, p.currency as payment_currency,
    p.stripe_checkout_session_id, p.stripe_payment_intent_id, o.created_at, o.updated_at
  from orders o left join payments p on p.order_id = o.id
`;

export async function createOrderFromGuestCartToken(
  token: string
): Promise<CreatedOrderRow> {
  return db.$transaction(async (tx) => {
    const cartRows = await tx.$queryRawUnsafe<CartIdRow[]>(
      `select id::text as id from carts where token = $1 limit 1 for update`,
      token
    );
    const cartRow = cartRows[0] ?? null;

    if (!cartRow) throw new OrderRepositoryError("missing_cart", "Guest cart is missing.");

    const checkoutRows = await tx.$queryRawUnsafe<CheckoutDraftRow[]>(
      `select id::text as id, customer_email, customer_first_name, customer_last_name,
        customer_phone, shipping_address_line_1, shipping_address_line_2, shipping_postal_code,
        shipping_city, shipping_country_code, billing_same_as_shipping, billing_first_name,
        billing_last_name, billing_phone, billing_address_line_1, billing_address_line_2,
        billing_postal_code, billing_city, billing_country_code
       from cart_checkout_details where cart_id = $1::bigint limit 1 for update`,
      cartRow.id
    );
    const checkoutRow = checkoutRows[0] ?? null;

    if (!checkoutDraftIsComplete(checkoutRow)) {
      throw new OrderRepositoryError("missing_checkout", "Checkout draft is missing.");
    }

    const sourceLines = await tx.$queryRawUnsafe<OrderSourceLineRow[]>(
      `select ci.id::text as cart_item_id, ci.product_variant_id::text as product_variant_id,
        ci.quantity, p.name as product_name, p.status as product_status, pv.name as variant_name,
        pv.status as variant_status, pv.color_name, pv.color_hex, pv.sku,
        pv.price::text as unit_price, pv.stock_quantity
       from cart_items ci
       inner join product_variants pv on pv.id = ci.product_variant_id
       inner join products p on p.id = pv.product_id
       where ci.cart_id = $1::bigint order by ci.created_at asc, ci.id asc for update of ci, pv`,
      cartRow.id
    );

    if (sourceLines.length === 0) throw new OrderRepositoryError("empty_cart", "Guest cart is empty.");
    if (sourceLines.some((line) => !sourceLineIsAvailable(line))) {
      throw new OrderRepositoryError("cart_unavailable", "Guest cart is no longer available.");
    }

    const totalAmountCents = sourceLines.reduce(
      (sum, line) => sum + moneyStringToCents(line.unit_price) * line.quantity, 0
    );
    const totalAmount = centsToMoneyString(totalAmountCents);

    let createdOrder: CreatedOrderRow | undefined;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const reference = createOrderReference();
      try {
        const orderRows = await tx.$queryRawUnsafe<CreatedOrderRow[]>(
          `insert into orders (reference, status, customer_email, customer_first_name,
            customer_last_name, customer_phone, shipping_address_line_1, shipping_address_line_2,
            shipping_postal_code, shipping_city, shipping_country_code, billing_same_as_shipping,
            billing_first_name, billing_last_name, billing_phone, billing_address_line_1,
            billing_address_line_2, billing_postal_code, billing_city, billing_country_code,
            total_amount)
           values ($1,'pending',$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20::numeric)
           returning id::text as id, reference`,
          reference, checkoutRow.customer_email, checkoutRow.customer_first_name,
          checkoutRow.customer_last_name, checkoutRow.customer_phone,
          checkoutRow.shipping_address_line_1, checkoutRow.shipping_address_line_2,
          checkoutRow.shipping_postal_code, checkoutRow.shipping_city,
          checkoutRow.shipping_country_code, checkoutRow.billing_same_as_shipping,
          checkoutRow.billing_first_name, checkoutRow.billing_last_name, checkoutRow.billing_phone,
          checkoutRow.billing_address_line_1, checkoutRow.billing_address_line_2,
          checkoutRow.billing_postal_code, checkoutRow.billing_city, checkoutRow.billing_country_code,
          totalAmount
        );
        createdOrder = orderRows[0];
        break;
      } catch (error) {
        if (isPostgreSqlErrorLike(error) && error.code === "23505" && error.constraint === "orders_reference_key") continue;
        throw error;
      }
    }

    if (!createdOrder) throw new OrderRepositoryError("create_failed", "Order reference generation failed.");

    await tx.$executeRawUnsafe(
      `insert into payments (order_id, provider, method, status, amount, currency)
       values ($1::bigint, 'stripe', 'card', 'pending', $2::numeric, 'eur')`,
      createdOrder.id, totalAmount
    );

    for (const line of sourceLines) {
      const unitPrice = normalizeMoneyString(line.unit_price);
      const lineTotal = centsToMoneyString(moneyStringToCents(unitPrice) * line.quantity);
      await tx.$executeRawUnsafe(
        `insert into order_items (order_id, source_product_variant_id, product_name, variant_name,
          color_name, color_hex, sku, unit_price, quantity, line_total)
         values ($1::bigint, $2::bigint, $3, $4, $5, $6, $7, $8::numeric, $9, $10::numeric)`,
        createdOrder.id, line.product_variant_id, line.product_name, line.variant_name,
        line.color_name, line.color_hex, line.sku, unitPrice, line.quantity, lineTotal
      );
    }

    for (const line of sourceLines) {
      await tx.$executeRawUnsafe(
        `update product_variants set stock_quantity = stock_quantity - $2 where id = $1::bigint`,
        line.product_variant_id, line.quantity
      );
    }

    await tx.$executeRawUnsafe(`delete from carts where id = $1::bigint`, cartRow.id);

    return createdOrder;
  });
}

export async function updateOrderStatus(input: {
  id: string; nextStatus: OrderStatus;
}): Promise<OrderStatus | null> {
  if (!isValidNumericId(input.id)) return null;

  return db.$transaction(async (tx) => {
    const rows = await tx.$queryRawUnsafe<OrderStatusRow[]>(
      `select id::text as id, status from orders where id = $1::bigint limit 1 for update`,
      input.id
    );
    const orderRow = rows[0] ?? null;

    if (orderRow === null) throw new OrderRepositoryError("missing_order", "Order is missing.");

    const transition = resolveOrderStatusTransition({ currentStatus: orderRow.status, nextStatus: input.nextStatus });
    if (!transition.ok) throw new OrderRepositoryError("invalid_status_transition", "Order status transition is invalid.");

    if (transition.shouldRestock) {
      await tx.$executeRawUnsafe(
        `update product_variants pv set stock_quantity = pv.stock_quantity + restock.total_quantity
         from (select source_product_variant_id as product_variant_id, sum(quantity)::integer as total_quantity
               from order_items where order_id = $1::bigint and source_product_variant_id is not null
               group by source_product_variant_id) restock
         where pv.id = restock.product_variant_id`,
        input.id
      );
    }

    await tx.$executeRawUnsafe(`update orders set status = $2 where id = $1::bigint`, input.id, input.nextStatus);
    return input.nextStatus;
  });
}

export async function shipOrder(input: {
  id: string; trackingReference: string | null;
}): Promise<OrderStatus | null> {
  if (!isValidNumericId(input.id)) return null;

  return db.$transaction(async (tx) => {
    const rows = await tx.$queryRawUnsafe<OrderStatusRow[]>(
      `select id::text as id, status from orders where id = $1::bigint limit 1 for update`,
      input.id
    );
    const orderRow = rows[0] ?? null;

    if (orderRow === null) throw new OrderRepositoryError("missing_order", "Order is missing.");

    const transition = resolveOrderStatusTransition({ currentStatus: orderRow.status, nextStatus: "shipped" });
    if (!transition.ok) throw new OrderRepositoryError("invalid_status_transition", "Order status transition is invalid.");

    await tx.$executeRawUnsafe(
      `update orders set status = 'shipped', shipped_at = now(), tracking_reference = $2 where id = $1::bigint`,
      input.id, input.trackingReference
    );
    return "shipped" as OrderStatus;
  });
}

export async function findPublicOrderByReference(reference: string): Promise<PublicOrderConfirmation | null> {
  if (!isValidOrderReference(reference)) return null;
  const orderRow = await queryFirst<OrderRow>(`${ORDER_WITH_PAYMENT_SELECT} where o.reference = $1 limit 1`, [reference]);
  if (orderRow === null) return null;
  const orderItems = await queryRows<OrderItemRow>(
    `select id::text as id, order_id::text as order_id, source_product_variant_id::text as source_product_variant_id,
      product_name, variant_name, color_name, color_hex, sku, unit_price::text as unit_price, quantity,
      line_total::text as line_total, created_at from order_items where order_id = $1::bigint order by id asc`,
    [orderRow.id]
  );
  return mapOrderRow(orderRow, orderItems);
}

export async function findOrderEmailContextById(id: string): Promise<OrderEmailContext | null> {
  if (!isValidNumericId(id)) return null;
  const row = await queryFirst<OrderEmailContextRow>(
    `select o.id::text as id, o.reference, o.customer_email, o.customer_first_name,
      o.total_amount::text as total_amount, o.tracking_reference
     from orders o where o.id = $1::bigint limit 1`,
    [id]
  );
  return row ? mapOrderEmailContext(row) : null;
}

export async function listAdminOrders(): Promise<AdminOrderSummary[]> {
  const rows = await queryRows<OrderSummaryRow>(
    `select o.id::text as id, o.reference, o.status, p.status as payment_status,
      o.customer_email, o.customer_first_name, o.customer_last_name,
      o.total_amount::text as total_amount, count(oi.id)::integer as line_count,
      o.created_at, o.updated_at
     from orders o left join payments p on p.order_id = o.id
     left join order_items oi on oi.order_id = o.id
     group by o.id, p.status order by o.created_at desc, o.id desc`
  );
  return rows.map(mapAdminOrderSummary);
}

export async function findAdminOrderById(id: string): Promise<AdminOrderDetail | null> {
  if (!isValidNumericId(id)) return null;
  const orderRow = await queryFirst<OrderRow>(`${ORDER_WITH_PAYMENT_SELECT} where o.id = $1::bigint limit 1`, [id]);
  if (orderRow === null) return null;
  const orderItems = await queryRows<OrderItemRow>(
    `select id::text as id, order_id::text as order_id, source_product_variant_id::text as source_product_variant_id,
      product_name, variant_name, color_name, color_hex, sku, unit_price::text as unit_price, quantity,
      line_total::text as line_total, created_at from order_items where order_id = $1::bigint order by id asc`,
    [orderRow.id]
  );
  const emailEvents = await listOrderEmailEventsByOrderId(orderRow.id);
  return { ...mapOrderRow(orderRow, orderItems), emailEvents };
}
