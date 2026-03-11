import { db, queryFirst, queryRows } from "@/db/client";

type TimestampValue = Date | string;
type ProductStatus = "draft" | "published";
type ProductVariantStatus = "draft" | "published";

type GuestCartIdRow = {
  id: string;
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

function mapGuestCartVariant(row: GuestCartVariantRow): GuestCartVariant {
  const isAvailable =
    row.product_status === "published" &&
    row.status === "published" &&
    row.stock_quantity > 0;

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
    isAvailable
  };
}

function mapGuestCartLine(row: GuestCartLineRow): GuestCartLine {
  const unitPrice = normalizeMoneyString(row.unit_price);
  const lineTotal = centsToMoneyString(moneyStringToCents(unitPrice) * row.quantity);
  const isAvailable =
    row.product_status === "published" &&
    row.variant_status === "published" &&
    row.stock_quantity >= row.quantity &&
    row.stock_quantity > 0;

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
    isAvailable,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
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

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    variantId: row.product_variant_id,
    quantity: row.quantity
  };
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

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    variantId: row.product_variant_id,
    quantity: row.quantity
  };
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

  if (rows.length === 0) {
    return null;
  }

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
