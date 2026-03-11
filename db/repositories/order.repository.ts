import { db, queryFirst, queryRows } from "@/db/client";
import type { PoolClient } from "pg";
import { createOrderReference } from "@/entities/order/order-reference";

type TimestampValue = Date | string;
type ProductStatus = "draft" | "published";
type ProductVariantStatus = "draft" | "published";
export type OrderStatus = "pending" | "cancelled";

type CartIdRow = {
  id: string;
};

type CheckoutDraftRow = {
  id: string;
  customer_email: string | null;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_phone: string | null;
  shipping_address_line_1: string | null;
  shipping_address_line_2: string | null;
  shipping_postal_code: string | null;
  shipping_city: string | null;
  shipping_country_code: string | null;
  billing_same_as_shipping: boolean;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_phone: string | null;
  billing_address_line_1: string | null;
  billing_address_line_2: string | null;
  billing_postal_code: string | null;
  billing_city: string | null;
  billing_country_code: string | null;
};

type OrderSourceLineRow = {
  cart_item_id: string;
  product_variant_id: string;
  quantity: number;
  product_name: string;
  product_status: ProductStatus;
  variant_name: string;
  variant_status: ProductVariantStatus;
  color_name: string;
  color_hex: string | null;
  sku: string;
  unit_price: string;
  stock_quantity: number;
};

type OrderRow = {
  id: string;
  reference: string;
  status: OrderStatus;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string | null;
  shipping_address_line_1: string;
  shipping_address_line_2: string | null;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_country_code: string;
  billing_same_as_shipping: boolean;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_phone: string | null;
  billing_address_line_1: string | null;
  billing_address_line_2: string | null;
  billing_postal_code: string | null;
  billing_city: string | null;
  billing_country_code: string | null;
  total_amount: string;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  source_product_variant_id: string | null;
  product_name: string;
  variant_name: string;
  color_name: string;
  color_hex: string | null;
  sku: string;
  unit_price: string;
  quantity: number;
  line_total: string;
  created_at: TimestampValue;
};

type OrderSummaryRow = {
  id: string;
  reference: string;
  status: OrderStatus;
  customer_email: string;
  customer_first_name: string;
  customer_last_name: string;
  total_amount: string;
  line_count: number;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type CreatedOrderRow = {
  id: string;
  reference: string;
};

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
};

export type OrderLine = {
  id: string;
  sourceProductVariantId: string | null;
  productName: string;
  variantName: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
  createdAt: string;
};

export type PublicOrderConfirmation = {
  id: string;
  reference: string;
  status: OrderStatus;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingPostalCode: string;
  shippingCity: string;
  shippingCountryCode: "FR";
  billingSameAsShipping: boolean;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingPhone: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountryCode: "FR" | null;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  lines: OrderLine[];
};

export type AdminOrderSummary = {
  id: string;
  reference: string;
  status: OrderStatus;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  totalAmount: string;
  lineCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminOrderDetail = PublicOrderConfirmation;

type OrderRepositoryErrorCode =
  | "missing_cart"
  | "empty_cart"
  | "missing_checkout"
  | "cart_unavailable"
  | "create_failed";

export class OrderRepositoryError extends Error {
  readonly code: OrderRepositoryErrorCode;

  constructor(code: OrderRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function isValidOrderReference(value: string): boolean {
  return /^CRY-[A-Z0-9]{10}$/.test(value);
}

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  if (!(error instanceof Error)) {
    return false;
  }

  const candidate = error as PostgreSqlErrorLike;

  return typeof candidate.code === "string";
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function normalizeMoneyString(value: string): string {
  const match = value.match(/^(\d+)(?:\.(\d{1,2}))?$/);

  if (!match) {
    return "0.00";
  }

  const [, major, minor = ""] = match;

  return `${major}.${minor.padEnd(2, "0")}`;
}

function moneyStringToCents(value: string): number {
  const normalizedValue = normalizeMoneyString(value);
  const [major, minor] = normalizedValue.split(".");

  return Number.parseInt(major ?? "0", 10) * 100 + Number.parseInt(minor ?? "0", 10);
}

function centsToMoneyString(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const normalizedValue = Math.abs(cents);
  const major = Math.floor(normalizedValue / 100);
  const minor = normalizedValue % 100;

  return `${sign}${major}.${minor.toString().padStart(2, "0")}`;
}

function checkoutDraftIsComplete(row: CheckoutDraftRow | null): row is CheckoutDraftRow {
  if (row === null) {
    return false;
  }

  if (
    row.customer_email === null ||
    row.customer_first_name === null ||
    row.customer_last_name === null ||
    row.shipping_address_line_1 === null ||
    row.shipping_postal_code === null ||
    row.shipping_city === null ||
    row.shipping_country_code !== "FR"
  ) {
    return false;
  }

  if (row.billing_same_as_shipping) {
    return true;
  }

  return (
    row.billing_first_name !== null &&
    row.billing_last_name !== null &&
    row.billing_address_line_1 !== null &&
    row.billing_postal_code !== null &&
    row.billing_city !== null &&
    row.billing_country_code === "FR"
  );
}

function sourceLineIsAvailable(row: OrderSourceLineRow): boolean {
  return (
    row.product_status === "published" &&
    row.variant_status === "published" &&
    row.stock_quantity >= row.quantity &&
    row.stock_quantity > 0
  );
}

function mapOrderLine(row: OrderItemRow): OrderLine {
  return {
    id: row.id,
    sourceProductVariantId: row.source_product_variant_id,
    productName: row.product_name,
    variantName: row.variant_name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    unitPrice: normalizeMoneyString(row.unit_price),
    quantity: row.quantity,
    lineTotal: normalizeMoneyString(row.line_total),
    createdAt: toIsoTimestamp(row.created_at)
  };
}

function mapOrderRow(
  row: OrderRow,
  lines: OrderItemRow[]
): PublicOrderConfirmation {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    customerPhone: row.customer_phone,
    shippingAddressLine1: row.shipping_address_line_1,
    shippingAddressLine2: row.shipping_address_line_2,
    shippingPostalCode: row.shipping_postal_code,
    shippingCity: row.shipping_city,
    shippingCountryCode: row.shipping_country_code as "FR",
    billingSameAsShipping: row.billing_same_as_shipping,
    billingFirstName: row.billing_first_name,
    billingLastName: row.billing_last_name,
    billingPhone: row.billing_phone,
    billingAddressLine1: row.billing_address_line_1,
    billingAddressLine2: row.billing_address_line_2,
    billingPostalCode: row.billing_postal_code,
    billingCity: row.billing_city,
    billingCountryCode: row.billing_country_code as "FR" | null,
    totalAmount: normalizeMoneyString(row.total_amount),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
    lines: lines.map(mapOrderLine)
  };
}

function mapAdminOrderSummary(row: OrderSummaryRow): AdminOrderSummary {
  return {
    id: row.id,
    reference: row.reference,
    status: row.status,
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    totalAmount: normalizeMoneyString(row.total_amount),
    lineCount: row.line_count,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

async function insertOrderWithUniqueReference(
  client: PoolClient,
  input: {
    checkout: CheckoutDraftRow;
    totalAmount: string;
  }
): Promise<CreatedOrderRow> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const reference = createOrderReference();

    try {
      const result = await client.query<CreatedOrderRow>(
        `
          insert into orders (
            reference,
            status,
            customer_email,
            customer_first_name,
            customer_last_name,
            customer_phone,
            shipping_address_line_1,
            shipping_address_line_2,
            shipping_postal_code,
            shipping_city,
            shipping_country_code,
            billing_same_as_shipping,
            billing_first_name,
            billing_last_name,
            billing_phone,
            billing_address_line_1,
            billing_address_line_2,
            billing_postal_code,
            billing_city,
            billing_country_code,
            total_amount
          )
          values (
            $1,
            'pending',
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            $13,
            $14,
            $15,
            $16,
            $17,
            $18,
            $19,
            $20::numeric
          )
          returning id::text as id, reference
        `,
        [
          reference,
          input.checkout.customer_email,
          input.checkout.customer_first_name,
          input.checkout.customer_last_name,
          input.checkout.customer_phone,
          input.checkout.shipping_address_line_1,
          input.checkout.shipping_address_line_2,
          input.checkout.shipping_postal_code,
          input.checkout.shipping_city,
          input.checkout.shipping_country_code,
          input.checkout.billing_same_as_shipping,
          input.checkout.billing_first_name,
          input.checkout.billing_last_name,
          input.checkout.billing_phone,
          input.checkout.billing_address_line_1,
          input.checkout.billing_address_line_2,
          input.checkout.billing_postal_code,
          input.checkout.billing_city,
          input.checkout.billing_country_code,
          input.totalAmount
        ]
      );

      const row = result.rows[0];

      if (!row) {
        throw new OrderRepositoryError(
          "create_failed",
          "Order creation failed."
        );
      }

      return row;
    } catch (error) {
      if (
        isPostgreSqlErrorLike(error) &&
        error.code === "23505" &&
        error.constraint === "orders_reference_key"
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new OrderRepositoryError(
    "create_failed",
    "Order reference generation failed."
  );
}

export async function createOrderFromGuestCartToken(
  token: string
): Promise<CreatedOrderRow> {
  const client = await db.connect();

  try {
    await client.query("begin");

    const cartResult = await client.query<CartIdRow>(
      `
        select id::text as id
        from carts
        where token = $1
        limit 1
        for update
      `,
      [token]
    );
    const cartRow = cartResult.rows[0];

    if (!cartRow) {
      throw new OrderRepositoryError("missing_cart", "Guest cart is missing.");
    }

    const checkoutResult = await client.query<CheckoutDraftRow>(
      `
        select
          id::text as id,
          customer_email,
          customer_first_name,
          customer_last_name,
          customer_phone,
          shipping_address_line_1,
          shipping_address_line_2,
          shipping_postal_code,
          shipping_city,
          shipping_country_code,
          billing_same_as_shipping,
          billing_first_name,
          billing_last_name,
          billing_phone,
          billing_address_line_1,
          billing_address_line_2,
          billing_postal_code,
          billing_city,
          billing_country_code
        from cart_checkout_details
        where cart_id = $1::bigint
        limit 1
        for update
      `,
      [cartRow.id]
    );
    const checkoutRow = checkoutResult.rows[0] ?? null;

    if (!checkoutDraftIsComplete(checkoutRow)) {
      throw new OrderRepositoryError(
        "missing_checkout",
        "Checkout draft is missing."
      );
    }

    const sourceLinesResult = await client.query<OrderSourceLineRow>(
      `
        select
          ci.id::text as cart_item_id,
          ci.product_variant_id::text as product_variant_id,
          ci.quantity,
          p.name as product_name,
          p.status as product_status,
          pv.name as variant_name,
          pv.status as variant_status,
          pv.color_name,
          pv.color_hex,
          pv.sku,
          pv.price::text as unit_price,
          pv.stock_quantity
        from cart_items ci
        inner join product_variants pv on pv.id = ci.product_variant_id
        inner join products p on p.id = pv.product_id
        where ci.cart_id = $1::bigint
        order by ci.created_at asc, ci.id asc
        for update of ci, pv
      `,
      [cartRow.id]
    );
    const sourceLines = sourceLinesResult.rows;

    if (sourceLines.length === 0) {
      throw new OrderRepositoryError("empty_cart", "Guest cart is empty.");
    }

    if (sourceLines.some((line) => !sourceLineIsAvailable(line))) {
      throw new OrderRepositoryError(
        "cart_unavailable",
        "Guest cart is no longer available."
      );
    }

    const totalAmountCents = sourceLines.reduce((sum, line) => {
      return sum + moneyStringToCents(line.unit_price) * line.quantity;
    }, 0);
    const totalAmount = centsToMoneyString(totalAmountCents);
    const createdOrder = await insertOrderWithUniqueReference(client, {
      checkout: checkoutRow,
      totalAmount
    });

    for (const line of sourceLines) {
      const unitPrice = normalizeMoneyString(line.unit_price);
      const lineTotal = centsToMoneyString(
        moneyStringToCents(unitPrice) * line.quantity
      );

      await client.query(
        `
          insert into order_items (
            order_id,
            source_product_variant_id,
            product_name,
            variant_name,
            color_name,
            color_hex,
            sku,
            unit_price,
            quantity,
            line_total
          )
          values (
            $1::bigint,
            $2::bigint,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8::numeric,
            $9,
            $10::numeric
          )
        `,
        [
          createdOrder.id,
          line.product_variant_id,
          line.product_name,
          line.variant_name,
          line.color_name,
          line.color_hex,
          line.sku,
          unitPrice,
          line.quantity,
          lineTotal
        ]
      );

      await client.query(
        `
          update product_variants
          set stock_quantity = stock_quantity - $2
          where id = $1::bigint
        `,
        [line.product_variant_id, line.quantity]
      );
    }

    await client.query(
      `
        delete from carts
        where id = $1::bigint
      `,
      [cartRow.id]
    );

    await client.query("commit");

    return createdOrder;
  } catch (error) {
    await client.query("rollback");

    if (error instanceof OrderRepositoryError) {
      throw error;
    }

    throw error;
  } finally {
    client.release();
  }
}

async function readOrderRowByReference(reference: string): Promise<OrderRow | null> {
  if (!isValidOrderReference(reference)) {
    return null;
  }

  return queryFirst<OrderRow>(
    `
      select
        id::text as id,
        reference,
        status,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        shipping_address_line_1,
        shipping_address_line_2,
        shipping_postal_code,
        shipping_city,
        shipping_country_code,
        billing_same_as_shipping,
        billing_first_name,
        billing_last_name,
        billing_phone,
        billing_address_line_1,
        billing_address_line_2,
        billing_postal_code,
        billing_city,
        billing_country_code,
        total_amount::text as total_amount,
        created_at,
        updated_at
      from orders
      where reference = $1
      limit 1
    `,
    [reference]
  );
}

async function readOrderRowById(id: string): Promise<OrderRow | null> {
  if (!isValidNumericId(id)) {
    return null;
  }

  return queryFirst<OrderRow>(
    `
      select
        id::text as id,
        reference,
        status,
        customer_email,
        customer_first_name,
        customer_last_name,
        customer_phone,
        shipping_address_line_1,
        shipping_address_line_2,
        shipping_postal_code,
        shipping_city,
        shipping_country_code,
        billing_same_as_shipping,
        billing_first_name,
        billing_last_name,
        billing_phone,
        billing_address_line_1,
        billing_address_line_2,
        billing_postal_code,
        billing_city,
        billing_country_code,
        total_amount::text as total_amount,
        created_at,
        updated_at
      from orders
      where id = $1::bigint
      limit 1
    `,
    [id]
  );
}

async function readOrderItemRows(orderId: string): Promise<OrderItemRow[]> {
  if (!isValidNumericId(orderId)) {
    return [];
  }

  return queryRows<OrderItemRow>(
    `
      select
        id::text as id,
        order_id::text as order_id,
        source_product_variant_id::text as source_product_variant_id,
        product_name,
        variant_name,
        color_name,
        color_hex,
        sku,
        unit_price::text as unit_price,
        quantity,
        line_total::text as line_total,
        created_at
      from order_items
      where order_id = $1::bigint
      order by id asc
    `,
    [orderId]
  );
}

export async function findPublicOrderByReference(
  reference: string
): Promise<PublicOrderConfirmation | null> {
  const orderRow = await readOrderRowByReference(reference);

  if (orderRow === null) {
    return null;
  }

  const orderItems = await readOrderItemRows(orderRow.id);

  return mapOrderRow(orderRow, orderItems);
}

export async function listAdminOrders(): Promise<AdminOrderSummary[]> {
  const rows = await queryRows<OrderSummaryRow>(
    `
      select
        o.id::text as id,
        o.reference,
        o.status,
        o.customer_email,
        o.customer_first_name,
        o.customer_last_name,
        o.total_amount::text as total_amount,
        count(oi.id)::integer as line_count,
        o.created_at,
        o.updated_at
      from orders o
      left join order_items oi on oi.order_id = o.id
      group by o.id
      order by o.created_at desc, o.id desc
    `
  );

  return rows.map(mapAdminOrderSummary);
}

export async function findAdminOrderById(
  id: string
): Promise<AdminOrderDetail | null> {
  const orderRow = await readOrderRowById(id);

  if (orderRow === null) {
    return null;
  }

  const orderItems = await readOrderItemRows(orderRow.id);

  return mapOrderRow(orderRow, orderItems);
}
