import { type PoolClient } from "pg";
import { db, queryFirst, queryRows } from "@/db/client";

type TimestampValue = Date | string;

type AdminProductImageRow = {
  id: string;
  product_id: string;
  variant_id: string | null;
  file_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ExistingRow = {
  id: string;
};

type DeletedImageRow = {
  id: string;
};

type CreateAdminProductImageInput = {
  productId: string;
  variantId: string | null;
  filePath: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

type UpdateAdminProductImageInput = {
  id: string;
  productId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type AdminProductImage = {
  id: string;
  productId: string;
  variantId: string | null;
  filePath: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export class AdminProductImageRepositoryError extends Error {
  readonly code: "variant_missing";

  constructor(message: string) {
    super(message);
    this.code = "variant_missing";
  }
}

function isValidNumericId(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

function mapAdminProductImage(row: AdminProductImageRow): AdminProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    variantId: row.variant_id,
    filePath: row.file_path,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    isPrimary: row.is_primary,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

async function productExists(
  client: PoolClient,
  productId: string
): Promise<boolean> {
  const result = await client.query<ExistingRow>(
    `
      select id::text as id
      from products
      where id = $1::bigint
      limit 1
    `,
    [productId]
  );

  return result.rows.length > 0;
}

async function variantExistsForProduct(
  client: PoolClient,
  productId: string,
  variantId: string
): Promise<boolean> {
  const result = await client.query<ExistingRow>(
    `
      select id::text as id
      from product_variants
      where id = $1::bigint
        and product_id = $2::bigint
      limit 1
    `,
    [variantId, productId]
  );

  return result.rows.length > 0;
}

async function clearPrimaryImageInScope(
  client: PoolClient,
  productId: string,
  variantId: string | null,
  excludedImageId?: string
): Promise<void> {
  if (variantId === null) {
    if (excludedImageId) {
      await client.query(
        `
          update product_images
          set is_primary = false
          where product_id = $1::bigint
            and variant_id is null
            and id <> $2::bigint
            and is_primary
        `,
        [productId, excludedImageId]
      );

      return;
    }

    await client.query(
      `
        update product_images
        set is_primary = false
        where product_id = $1::bigint
          and variant_id is null
          and is_primary
      `,
      [productId]
    );

    return;
  }

  if (excludedImageId) {
    await client.query(
      `
        update product_images
        set is_primary = false
        where variant_id = $1::bigint
          and id <> $2::bigint
          and is_primary
      `,
      [variantId, excludedImageId]
    );

    return;
  }

  await client.query(
    `
      update product_images
      set is_primary = false
      where variant_id = $1::bigint
        and is_primary
    `,
    [variantId]
  );
}

async function findProductImageRow(
  client: PoolClient,
  productId: string,
  imageId: string
): Promise<AdminProductImageRow | null> {
  const result = await client.query<AdminProductImageRow>(
    `
      select
        pi.id::text as id,
        pi.product_id::text as product_id,
        pi.variant_id::text as variant_id,
        pi.file_path,
        pi.alt_text,
        pi.sort_order,
        pi.is_primary,
        pi.created_at,
        pi.updated_at
      from product_images pi
      where pi.id = $1::bigint
        and pi.product_id = $2::bigint
      limit 1
    `,
    [imageId, productId]
  );

  return result.rows[0] ?? null;
}

export async function listAdminProductImages(
  productId: string
): Promise<AdminProductImage[]> {
  if (!isValidNumericId(productId)) {
    return [];
  }

  const rows = await queryRows<AdminProductImageRow>(
    `
      select
        pi.id::text as id,
        pi.product_id::text as product_id,
        pi.variant_id::text as variant_id,
        pi.file_path,
        pi.alt_text,
        pi.sort_order,
        pi.is_primary,
        pi.created_at,
        pi.updated_at
      from product_images pi
      where pi.product_id = $1::bigint
      order by pi.variant_id nulls first, pi.sort_order asc, pi.id asc
    `,
    [productId]
  );

  return rows.map(mapAdminProductImage);
}

export async function createAdminProductImage(
  input: CreateAdminProductImageInput
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(input.productId)) {
    return null;
  }

  if (input.variantId !== null && !isValidNumericId(input.variantId)) {
    throw new AdminProductImageRepositoryError(
      "Selected variant does not belong to this product."
    );
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    if (!(await productExists(client, input.productId))) {
      await client.query("rollback");
      return null;
    }

    if (
      input.variantId !== null &&
      !(await variantExistsForProduct(client, input.productId, input.variantId))
    ) {
      throw new AdminProductImageRepositoryError(
        "Selected variant does not belong to this product."
      );
    }

    if (input.isPrimary) {
      await clearPrimaryImageInScope(client, input.productId, input.variantId);
    }

    const result = await client.query<AdminProductImageRow>(
      `
        insert into product_images (
          product_id,
          variant_id,
          file_path,
          alt_text,
          sort_order,
          is_primary
        )
        values ($1::bigint, $2::bigint, $3, $4, $5, $6)
        returning
          id::text as id,
          product_id::text as product_id,
          variant_id::text as variant_id,
          file_path,
          alt_text,
          sort_order,
          is_primary,
          created_at,
          updated_at
      `,
      [
        input.productId,
        input.variantId,
        input.filePath,
        input.altText,
        input.sortOrder,
        input.isPrimary
      ]
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create product image.");
    }

    await client.query("commit");

    return mapAdminProductImage(row);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductImageRepositoryError) {
      throw error;
    }

    throw error;
  } finally {
    client.release();
  }
}

export async function updateAdminProductImage(
  input: UpdateAdminProductImageInput
): Promise<AdminProductImage | null> {
  if (!isValidNumericId(input.productId) || !isValidNumericId(input.id)) {
    return null;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    const currentImage = await findProductImageRow(client, input.productId, input.id);

    if (currentImage === null) {
      await client.query("rollback");
      return null;
    }

    if (input.isPrimary) {
      await clearPrimaryImageInScope(
        client,
        input.productId,
        currentImage.variant_id,
        input.id
      );
    }

    const result = await client.query<AdminProductImageRow>(
      `
        update product_images
        set
          alt_text = $3,
          sort_order = $4,
          is_primary = $5
        where id = $1::bigint
          and product_id = $2::bigint
        returning
          id::text as id,
          product_id::text as product_id,
          variant_id::text as variant_id,
          file_path,
          alt_text,
          sort_order,
          is_primary,
          created_at,
          updated_at
      `,
      [input.id, input.productId, input.altText, input.sortOrder, input.isPrimary]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    await client.query("commit");

    return mapAdminProductImage(row);
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function deleteAdminProductImage(
  productId: string,
  imageId: string
): Promise<boolean> {
  if (!isValidNumericId(productId) || !isValidNumericId(imageId)) {
    return false;
  }

  const row = await queryFirst<DeletedImageRow>(
    `
      delete from product_images
      where id = $1::bigint
        and product_id = $2::bigint
      returning id::text as id
    `,
    [imageId, productId]
  );

  return row !== null;
}
