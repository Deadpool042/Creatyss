import { type PoolClient } from "pg";
import { db, queryRows } from "@/db/client";
import { syncNativeSimpleProductOfferFromLegacyVariant } from "@/db/repositories/simple-product-admin-compatibility";
import {
  canDeleteVariantForProductType,
  canCreateVariantForProductType,
  type ProductTypeCompatibilityErrorCode
} from "@/entities/product/product-type-rules";
import { type ProductType } from "@/entities/product/product-input";

// --- Internal types ---

// pg may return Date or string for timestamp columns depending on driver configuration
type TimestampValue = Date | string;

type AdminProductVariantStatus = "draft" | "published";

type AdminProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  color_name: string;
  color_hex: string | null;
  sku: string;
  price: string;
  compare_at_price: string | null;
  stock_quantity: number;
  is_default: boolean;
  status: AdminProductVariantStatus;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ProductCompatibilityRow = {
  id: string;
  product_type: ProductType;
};

type CountRow = {
  variant_count: number;
};

type DeletedVariantRow = {
  id: string;
};

type CreateAdminProductVariantInput = {
  productId: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: AdminProductVariantStatus;
};

type UpdateAdminProductVariantInput = CreateAdminProductVariantInput & {
  id: string;
};

type RepositoryErrorCode = "sku_taken" | ProductTypeCompatibilityErrorCode;

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
};

// --- Public types ---

export type AdminProductVariant = {
  id: string;
  productId: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: AdminProductVariantStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export class AdminProductVariantRepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

// --- Internal helpers ---

const PG_UNIQUE_VIOLATION = "23505";
const VARIANT_SKU_CONSTRAINT = "product_variants_sku_key";

// Full column list shared by list, create (returning), and update (returning) — no alias prefix needed (single-table queries)
const PRODUCT_VARIANT_COLUMNS =
  "id::text as id, product_id::text as product_id, name, color_name, color_hex, sku, price::text as price, compare_at_price::text as compare_at_price, stock_quantity, is_default, status, created_at, updated_at";

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  return (
    error instanceof Error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapAdminProductVariant(
  row: AdminProductVariantRow
): AdminProductVariant {
  return {
    id: row.id,
    productId: row.product_id,
    name: row.name,
    colorName: row.color_name,
    colorHex: row.color_hex,
    sku: row.sku,
    price: row.price,
    compareAtPrice: row.compare_at_price,
    stockQuantity: row.stock_quantity,
    isDefault: row.is_default,
    status: row.status,
    isAvailable: row.status === "published" && row.stock_quantity > 0,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

// Builds the 9 shared field parameters — productId is NOT included; callers prepend it.
// Create: [input.productId, ...buildProductVariantWriteParams(input)] → $1=productId, $2=name … $10=status
// Update: [input.id, input.productId, ...buildProductVariantWriteParams(input)] → $1=id, $2=productId, $3=name … $11=status
function buildProductVariantWriteParams(
  input: CreateAdminProductVariantInput
): unknown[] {
  return [
    input.name,
    input.colorName,
    input.colorHex,
    input.sku,
    input.price,
    input.compareAtPrice,
    input.stockQuantity,
    input.isDefault,
    input.status
  ];
}

function mapRepositoryError(error: unknown): never {
  if (isPostgreSqlErrorLike(error)) {
    if (
      error.code === PG_UNIQUE_VIOLATION &&
      error.constraint === VARIANT_SKU_CONSTRAINT
    ) {
      throw new AdminProductVariantRepositoryError(
        "sku_taken",
        "Variant SKU already exists."
      );
    }
  }

  throw error;
}

// --- Internal transaction helpers ---

async function readProductTypeById(
  client: PoolClient,
  productId: string
): Promise<ProductCompatibilityRow | null> {
  const result = await client.query<ProductCompatibilityRow>(
    `
      select
        id::text as id,
        product_type
      from products
      where id = $1::bigint
      limit 1
    `,
    [productId]
  );

  return result.rows[0] ?? null;
}

async function countVariantsForProduct(
  client: PoolClient,
  productId: string
): Promise<number> {
  const result = await client.query<CountRow>(
    `
      select count(*)::int as variant_count
      from product_variants
      where product_id = $1::bigint
    `,
    [productId]
  );

  return result.rows[0]?.variant_count ?? 0;
}

async function clearDefaultVariant(
  client: PoolClient,
  productId: string,
  excludedVariantId?: string
): Promise<void> {
  if (excludedVariantId) {
    await client.query(
      `
        update product_variants
        set is_default = false
        where product_id = $1::bigint
          and id <> $2::bigint
          and is_default
      `,
      [productId, excludedVariantId]
    );

    return;
  }

  await client.query(
    `
      update product_variants
      set is_default = false
      where product_id = $1::bigint
        and is_default
    `,
    [productId]
  );
}

// --- Public functions ---

export async function listAdminProductVariants(
  productId: string
): Promise<AdminProductVariant[]> {
  if (!isValidNumericId(productId)) {
    return [];
  }

  const rows = await queryRows<AdminProductVariantRow>(
    `
      select ${PRODUCT_VARIANT_COLUMNS}
      from product_variants
      where product_id = $1::bigint
      order by is_default desc, id asc
    `,
    [productId]
  );

  return rows.map(mapAdminProductVariant);
}

export async function createAdminProductVariant(
  input: CreateAdminProductVariantInput
): Promise<AdminProductVariant | null> {
  if (!isValidNumericId(input.productId)) {
    return null;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    const product = await readProductTypeById(client, input.productId);

    if (product === null) {
      await client.query("rollback");
      return null;
    }

    const existingVariantCount = await countVariantsForProduct(
      client,
      input.productId
    );

    if (
      !canCreateVariantForProductType(
        product.product_type,
        existingVariantCount
      )
    ) {
      throw new AdminProductVariantRepositoryError(
        "simple_product_single_variant_only",
        "A simple product can only have one sellable variant."
      );
    }

    if (input.isDefault) {
      await clearDefaultVariant(client, input.productId);
    }

    const result = await client.query<AdminProductVariantRow>(
      `
        insert into product_variants (
          product_id,
          name,
          color_name,
          color_hex,
          sku,
          price,
          compare_at_price,
          stock_quantity,
          is_default,
          status
        )
        values ($1::bigint, $2, $3, $4, $5, $6::numeric, $7::numeric, $8, $9, $10)
        returning ${PRODUCT_VARIANT_COLUMNS}
      `,
      [input.productId, ...buildProductVariantWriteParams(input)]
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create product variant.");
    }

    if (product.product_type === "simple") {
      await syncNativeSimpleProductOfferFromLegacyVariant(client, {
        productId: input.productId,
        variantId: row.id
      });
    }

    await client.query("commit");

    return mapAdminProductVariant(row);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductVariantRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}

export async function updateAdminProductVariant(
  input: UpdateAdminProductVariantInput
): Promise<AdminProductVariant | null> {
  if (!isValidNumericId(input.productId) || !isValidNumericId(input.id)) {
    return null;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    const product = await readProductTypeById(client, input.productId);

    if (product === null) {
      await client.query("rollback");
      return null;
    }

    if (input.isDefault) {
      await clearDefaultVariant(client, input.productId, input.id);
    }

    const result = await client.query<AdminProductVariantRow>(
      `
        update product_variants
        set
          name = $3,
          color_name = $4,
          color_hex = $5,
          sku = $6,
          price = $7::numeric,
          compare_at_price = $8::numeric,
          stock_quantity = $9,
          is_default = $10,
          status = $11
        where id = $1::bigint
          and product_id = $2::bigint
        returning ${PRODUCT_VARIANT_COLUMNS}
      `,
      [input.id, input.productId, ...buildProductVariantWriteParams(input)]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    if (product.product_type === "simple") {
      await syncNativeSimpleProductOfferFromLegacyVariant(client, {
        productId: input.productId,
        variantId: input.id
      });
    }

    await client.query("commit");

    return mapAdminProductVariant(row);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductVariantRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}

export async function deleteAdminProductVariant(
  productId: string,
  variantId: string
): Promise<boolean> {
  if (!isValidNumericId(productId) || !isValidNumericId(variantId)) {
    return false;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    const product = await readProductTypeById(client, productId);

    if (product === null) {
      await client.query("rollback");
      return false;
    }

    const existingVariantCount = await countVariantsForProduct(client, productId);

    if (
      !canDeleteVariantForProductType(
        product.product_type,
        existingVariantCount
      )
    ) {
      throw new AdminProductVariantRepositoryError(
        "simple_product_requires_sellable_variant",
        "A simple product must keep its single sellable variant."
      );
    }

    const result = await client.query<DeletedVariantRow>(
      `
        delete from product_variants
        where id = $1::bigint
          and product_id = $2::bigint
        returning id::text as id
      `,
      [variantId, productId]
    );

    const row = result.rows[0] ?? null;

    if (row === null) {
      await client.query("rollback");
      return false;
    }

    if (product.product_type === "simple") {
      await syncNativeSimpleProductOfferFromLegacyVariant(client, {
        productId
      });
    }

    await client.query("commit");

    return true;
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductVariantRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}
