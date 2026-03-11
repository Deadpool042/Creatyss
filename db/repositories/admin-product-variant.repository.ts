import { type PoolClient } from "pg";
import { db, queryFirst, queryRows } from "@/db/client";
import {
  canDeleteVariantForProductType,
  canCreateVariantForProductType,
  type ProductTypeCompatibilityErrorCode
} from "@/entities/product/product-type-rules";
import { type ProductType } from "@/entities/product/product-input";

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

type ExistingVariantRow = {
  id: string;
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

type SimpleProductFieldsRow = {
  sku: string;
  price: string;
  compare_at_price: string | null;
  stock_quantity: number;
};

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
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

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  if (!(error instanceof Error)) {
    return false;
  }

  const candidate = error as Error & {
    code?: unknown;
    constraint?: unknown;
  };

  return typeof candidate.code === "string";
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

function mapRepositoryError(error: unknown): never {
  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "product_variants_sku_key"
  ) {
    throw new AdminProductVariantRepositoryError(
      "sku_taken",
      "Variant SKU already exists."
    );
  }

  throw error;
}

async function productExists(
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

async function clearSimpleProductFields(
  client: PoolClient,
  productId: string
): Promise<void> {
  await client.query(
    `
      update products
      set
        simple_sku = null,
        simple_price = null,
        simple_compare_at_price = null,
        simple_stock_quantity = null
      where id = $1::bigint
    `,
    [productId]
  );
}

async function readVariantFieldsForSimpleProduct(
  client: PoolClient,
  productId: string,
  variantId?: string
): Promise<SimpleProductFieldsRow | null> {
  const result = await client.query<SimpleProductFieldsRow>(
    `
      select
        pv.sku,
        pv.price::text as price,
        pv.compare_at_price::text as compare_at_price,
        pv.stock_quantity
      from product_variants pv
      where pv.product_id = $1::bigint
        and ($2::bigint is null or pv.id = $2::bigint)
      order by pv.is_default desc, pv.id asc
      limit 1
    `,
    [productId, variantId ?? null]
  );

  return result.rows[0] ?? null;
}

async function syncSimpleProductFields(
  client: PoolClient,
  productId: string,
  variantId?: string
): Promise<void> {
  const variantFields = await readVariantFieldsForSimpleProduct(
    client,
    productId,
    variantId
  );

  if (variantFields === null) {
    await clearSimpleProductFields(client, productId);
    return;
  }

  await client.query(
    `
      update products
      set
        simple_sku = $2,
        simple_price = $3::numeric,
        simple_compare_at_price = $4::numeric,
        simple_stock_quantity = $5
      where id = $1::bigint
    `,
    [
      productId,
      variantFields.sku,
      variantFields.price,
      variantFields.compare_at_price,
      variantFields.stock_quantity
    ]
  );
}

export async function listAdminProductVariants(
  productId: string
): Promise<AdminProductVariant[]> {
  if (!isValidNumericId(productId)) {
    return [];
  }

  const rows = await queryRows<AdminProductVariantRow>(
    `
      select
        pv.id::text as id,
        pv.product_id::text as product_id,
        pv.name,
        pv.color_name,
        pv.color_hex,
        pv.sku,
        pv.price::text as price,
        pv.compare_at_price::text as compare_at_price,
        pv.stock_quantity,
        pv.is_default,
        pv.status,
        pv.created_at,
        pv.updated_at
      from product_variants pv
      where pv.product_id = $1::bigint
      order by pv.is_default desc, pv.id asc
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

    const product = await productExists(client, input.productId);

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
        returning
          id::text as id,
          product_id::text as product_id,
          name,
          color_name,
          color_hex,
          sku,
          price::text as price,
          compare_at_price::text as compare_at_price,
          stock_quantity,
          is_default,
          status,
          created_at,
          updated_at
      `,
      [
        input.productId,
        input.name,
        input.colorName,
        input.colorHex,
        input.sku,
        input.price,
        input.compareAtPrice,
        input.stockQuantity,
        input.isDefault,
        input.status
      ]
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create product variant.");
    }

    if (product.product_type === "simple") {
      await syncSimpleProductFields(client, input.productId, row.id);
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

    const product = await productExists(client, input.productId);

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
        returning
          id::text as id,
          product_id::text as product_id,
          name,
          color_name,
          color_hex,
          sku,
          price::text as price,
          compare_at_price::text as compare_at_price,
          stock_quantity,
          is_default,
          status,
          created_at,
          updated_at
      `,
      [
        input.id,
        input.productId,
        input.name,
        input.colorName,
        input.colorHex,
        input.sku,
        input.price,
        input.compareAtPrice,
        input.stockQuantity,
        input.isDefault,
        input.status
      ]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    if (product.product_type === "simple") {
      await syncSimpleProductFields(client, input.productId, input.id);
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

    const product = await productExists(client, productId);

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
      await syncSimpleProductFields(client, productId);
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
