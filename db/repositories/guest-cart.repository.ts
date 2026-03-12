import { db, queryFirst, queryRows } from "@/db/client";

type TimestampValue = Date | string;
type ProductStatus = "draft" | "published";
type ProductVariantStatus = "draft" | "published";

type GuestCartIdRow = {
  id: string;
};

type GuestCartCheckoutDetailsRow = {
  id: string;
  cart_id: string;
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
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type GuestCartVariantRow = {
  id: string;
  product_id: string;
  product_slug: string;
  product_name: string;
  product_status: ProductStatus;
  name: string;
  color_name: string;
  color_hex: string | null;
  sku: string;
  price: string;
  stock_quantity: number;
  status: ProductVariantStatus;
};

type GuestCartItemReferenceRow = {
  id: string;
  product_variant_id: string;
  quantity: number;
};

type GuestCartLineRow = {
  cart_id: string;
  id: string;
  product_variant_id: string;
  quantity: number;
  product_id: string;
  product_slug: string;
  product_name: string;
  product_status: ProductStatus;
  variant_name: string;
  color_name: string;
  color_hex: string | null;
  sku: string;
  unit_price: string;
  stock_quantity: number;
  variant_status: ProductVariantStatus;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

export type GuestCartVariant = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  productStatus: ProductStatus;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  stockQuantity: number;
  status: ProductVariantStatus;
  isAvailable: boolean;
};

export type GuestCartItemReference = {
  id: string;
  variantId: string;
  quantity: number;
};

export type GuestCartLine = {
  id: string;
  variantId: string;
  quantity: number;
  productId: string;
  productSlug: string;
  productName: string;
  variantName: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  unitPrice: string;
  lineTotal: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GuestCart = {
  id: string;
  itemCount: number;
  subtotal: string;
  lines: GuestCartLine[];
};

export type GuestCheckoutDetails = {
  id: string;
  cartId: string;
  customerEmail: string | null;
  customerFirstName: string | null;
  customerLastName: string | null;
  customerPhone: string | null;
  shippingAddressLine1: string | null;
  shippingAddressLine2: string | null;
  shippingPostalCode: string | null;
  shippingCity: string | null;
  shippingCountryCode: "FR" | null;
  billingSameAsShipping: boolean;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingPhone: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountryCode: "FR" | null;
  createdAt: string;
  updatedAt: string;
};

export type GuestCheckoutIssueCode = "empty_cart" | "cart_unavailable";

export type GuestCheckoutContext = {
  cart: GuestCart | null;
  draft: GuestCheckoutDetails | null;
  issues: GuestCheckoutIssueCode[];
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

function isGuestCartVariantAvailable(row: GuestCartVariantRow): boolean {
  return (
    row.product_status === "published" &&
    row.status === "published" &&
    row.stock_quantity > 0
  );
}

function isGuestCartLineAvailable(row: GuestCartLineRow): boolean {
  return (
    row.product_status === "published" &&
    row.variant_status === "published" &&
    row.stock_quantity >= row.quantity &&
    row.stock_quantity > 0
  );
}

function mapGuestCartItemReference(
  row: GuestCartItemReferenceRow
): GuestCartItemReference {
  return {
    id: row.id,
    variantId: row.product_variant_id,
    quantity: row.quantity
  };
}

function mapGuestCartVariant(row: GuestCartVariantRow): GuestCartVariant {
  return {
    id: row.id,
    productId: row.product_id,
    productSlug: row.product_slug,
    productName: row.product_name,
    productStatus: row.product_status,
    name: row.name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    price: normalizeMoneyString(row.price),
    stockQuantity: row.stock_quantity,
    status: row.status,
    isAvailable: isGuestCartVariantAvailable(row)
  };
}

function mapGuestCartLine(row: GuestCartLineRow): GuestCartLine {
  const unitPrice = normalizeMoneyString(row.unit_price);
  const lineTotal = centsToMoneyString(moneyStringToCents(unitPrice) * row.quantity);

  return {
    id: row.id,
    variantId: row.product_variant_id,
    quantity: row.quantity,
    productId: row.product_id,
    productSlug: row.product_slug,
    productName: row.product_name,
    variantName: row.variant_name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    unitPrice,
    lineTotal,
    isAvailable: isGuestCartLineAvailable(row),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapGuestCheckoutDetails(
  row: GuestCartCheckoutDetailsRow
): GuestCheckoutDetails {
  return {
    id: row.id,
    cartId: row.cart_id,
    customerEmail: row.customer_email,
    customerFirstName: row.customer_first_name,
    customerLastName: row.customer_last_name,
    customerPhone: row.customer_phone,
    shippingAddressLine1: row.shipping_address_line_1,
    shippingAddressLine2: row.shipping_address_line_2,
    shippingPostalCode: row.shipping_postal_code,
    shippingCity: row.shipping_city,
    shippingCountryCode: row.shipping_country_code as "FR" | null,
    billingSameAsShipping: row.billing_same_as_shipping,
    billingFirstName: row.billing_first_name,
    billingLastName: row.billing_last_name,
    billingPhone: row.billing_phone,
    billingAddressLine1: row.billing_address_line_1,
    billingAddressLine2: row.billing_address_line_2,
    billingPostalCode: row.billing_postal_code,
    billingCity: row.billing_city,
    billingCountryCode: row.billing_country_code as "FR" | null,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function getGuestCheckoutIssues(cart: GuestCart | null): GuestCheckoutIssueCode[] {
  if (cart === null || cart.lines.length === 0) {
    return ["empty_cart"];
  }

  if (cart.lines.some((line) => !line.isAvailable)) {
    return ["cart_unavailable"];
  }

  return [];
}

function buildGuestCartFromLineRows(
  rows: readonly GuestCartLineRow[]
): GuestCart | null {
  const firstRow = rows[0];

  if (!firstRow) {
    return null;
  }

  const lines = rows.map(mapGuestCartLine);
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalCents = lines.reduce(
    (sum, line) => sum + moneyStringToCents(line.lineTotal),
    0
  );

  return {
    id: firstRow.cart_id,
    itemCount,
    subtotal: centsToMoneyString(subtotalCents),
    lines
  };
}

export async function findGuestCartIdByToken(token: string): Promise<string | null> {
  const row = await queryFirst<GuestCartIdRow>(
    `
      select id::text as id
      from carts
      where token = $1
      limit 1
    `,
    [token]
  );

  return row?.id ?? null;
}

export async function createGuestCart(token: string): Promise<string> {
  const row = await queryFirst<GuestCartIdRow>(
    `
      insert into carts (token)
      values ($1)
      returning id::text as id
    `,
    [token]
  );

  if (!row) {
    throw new Error("Guest cart creation failed.");
  }

  return row.id;
}

export async function findGuestCartVariantById(
  variantId: string
): Promise<GuestCartVariant | null> {
  if (!isValidNumericId(variantId)) {
    return null;
  }

  const row = await queryFirst<GuestCartVariantRow>(
    `
      select
        pv.id::text as id,
        pv.product_id::text as product_id,
        p.slug as product_slug,
        p.name as product_name,
        p.status as product_status,
        pv.name,
        pv.color_name,
        pv.color_hex,
        pv.sku,
        pv.price::text as price,
        pv.stock_quantity,
        pv.status
      from product_variants pv
      inner join products p on p.id = pv.product_id
      where pv.id = $1::bigint
      limit 1
    `,
    [variantId]
  );

  return row ? mapGuestCartVariant(row) : null;
}

export async function findGuestCartItemByVariant(
  cartId: string,
  variantId: string
): Promise<GuestCartItemReference | null> {
  if (!isValidNumericId(cartId) || !isValidNumericId(variantId)) {
    return null;
  }

  const row = await queryFirst<GuestCartItemReferenceRow>(
    `
      select
        id::text as id,
        product_variant_id::text as product_variant_id,
        quantity
      from cart_items
      where cart_id = $1::bigint
        and product_variant_id = $2::bigint
      limit 1
    `,
    [cartId, variantId]
  );

  return row ? mapGuestCartItemReference(row) : null;
}

export async function findGuestCartItemById(
  cartId: string,
  itemId: string
): Promise<GuestCartItemReference | null> {
  if (!isValidNumericId(cartId) || !isValidNumericId(itemId)) {
    return null;
  }

  const row = await queryFirst<GuestCartItemReferenceRow>(
    `
      select
        id::text as id,
        product_variant_id::text as product_variant_id,
        quantity
      from cart_items
      where cart_id = $1::bigint
        and id = $2::bigint
      limit 1
    `,
    [cartId, itemId]
  );

  return row ? mapGuestCartItemReference(row) : null;
}

export async function addGuestCartItemQuantity(input: {
  cartId: string;
  variantId: string;
  quantity: number;
}): Promise<void> {
  await db.query(
    `
      insert into cart_items (cart_id, product_variant_id, quantity)
      values ($1::bigint, $2::bigint, $3)
      on conflict (cart_id, product_variant_id)
      do update
      set quantity = cart_items.quantity + excluded.quantity
    `,
    [input.cartId, input.variantId, input.quantity]
  );
}

export async function updateGuestCartItemQuantity(input: {
  cartId: string;
  itemId: string;
  quantity: number;
}): Promise<boolean> {
  const row = await queryFirst<GuestCartIdRow>(
    `
      update cart_items
      set quantity = $3
      where cart_id = $1::bigint
        and id = $2::bigint
      returning id::text as id
    `,
    [input.cartId, input.itemId, input.quantity]
  );

  return row !== null;
}

export async function removeGuestCartItem(input: {
  cartId: string;
  itemId: string;
}): Promise<boolean> {
  const row = await queryFirst<GuestCartIdRow>(
    `
      delete from cart_items
      where cart_id = $1::bigint
        and id = $2::bigint
      returning id::text as id
    `,
    [input.cartId, input.itemId]
  );

  return row !== null;
}

export async function readGuestCartByToken(token: string): Promise<GuestCart | null> {
  const rows = await queryRows<GuestCartLineRow>(
    `
      select
        c.id::text as cart_id,
        ci.id::text as id,
        ci.product_variant_id::text as product_variant_id,
        ci.quantity,
        p.id::text as product_id,
        p.slug as product_slug,
        p.name as product_name,
        p.status as product_status,
        pv.name as variant_name,
        pv.color_name,
        pv.color_hex,
        pv.sku,
        pv.price::text as unit_price,
        pv.stock_quantity,
        pv.status as variant_status,
        ci.created_at,
        ci.updated_at
      from carts c
      inner join cart_items ci on ci.cart_id = c.id
      inner join product_variants pv on pv.id = ci.product_variant_id
      inner join products p on p.id = pv.product_id
      where c.token = $1
      order by ci.created_at asc, ci.id asc
    `,
    [token]
  );

  return buildGuestCartFromLineRows(rows);
}

export async function readGuestCheckoutDetailsByCartId(
  cartId: string
): Promise<GuestCheckoutDetails | null> {
  if (!isValidNumericId(cartId)) {
    return null;
  }

  const row = await queryFirst<GuestCartCheckoutDetailsRow>(
    `
      select
        id::text as id,
        cart_id::text as cart_id,
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
        created_at,
        updated_at
      from cart_checkout_details
      where cart_id = $1::bigint
      limit 1
    `,
    [cartId]
  );

  return row ? mapGuestCheckoutDetails(row) : null;
}

export async function upsertGuestCheckoutDetails(input: {
  cartId: string;
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
}): Promise<GuestCheckoutDetails> {
  const row = await queryFirst<GuestCartCheckoutDetailsRow>(
    `
      insert into cart_checkout_details (
        cart_id,
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
      )
      values (
        $1::bigint,
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
        $19
      )
      on conflict (cart_id)
      do update
      set
        customer_email = excluded.customer_email,
        customer_first_name = excluded.customer_first_name,
        customer_last_name = excluded.customer_last_name,
        customer_phone = excluded.customer_phone,
        shipping_address_line_1 = excluded.shipping_address_line_1,
        shipping_address_line_2 = excluded.shipping_address_line_2,
        shipping_postal_code = excluded.shipping_postal_code,
        shipping_city = excluded.shipping_city,
        shipping_country_code = excluded.shipping_country_code,
        billing_same_as_shipping = excluded.billing_same_as_shipping,
        billing_first_name = excluded.billing_first_name,
        billing_last_name = excluded.billing_last_name,
        billing_phone = excluded.billing_phone,
        billing_address_line_1 = excluded.billing_address_line_1,
        billing_address_line_2 = excluded.billing_address_line_2,
        billing_postal_code = excluded.billing_postal_code,
        billing_city = excluded.billing_city,
        billing_country_code = excluded.billing_country_code
      returning
        id::text as id,
        cart_id::text as cart_id,
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
        created_at,
        updated_at
    `,
    [
      input.cartId,
      input.customerEmail,
      input.customerFirstName,
      input.customerLastName,
      input.customerPhone,
      input.shippingAddressLine1,
      input.shippingAddressLine2,
      input.shippingPostalCode,
      input.shippingCity,
      input.shippingCountryCode,
      input.billingSameAsShipping,
      input.billingFirstName,
      input.billingLastName,
      input.billingPhone,
      input.billingAddressLine1,
      input.billingAddressLine2,
      input.billingPostalCode,
      input.billingCity,
      input.billingCountryCode
    ]
  );

  if (!row) {
    throw new Error("Guest checkout details save failed.");
  }

  return mapGuestCheckoutDetails(row);
}

export async function readGuestCheckoutContextByToken(
  token: string
): Promise<GuestCheckoutContext | null> {
  const cartId = await findGuestCartIdByToken(token);

  if (cartId === null) {
    return null;
  }

  const [cart, draft] = await Promise.all([
    readGuestCartByToken(token),
    readGuestCheckoutDetailsByCartId(cartId)
  ]);

  return {
    cart,
    draft,
    issues: getGuestCheckoutIssues(cart)
  };
}
