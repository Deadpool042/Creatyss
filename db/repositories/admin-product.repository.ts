import { type PoolClient } from "pg";
import { db, queryFirst, queryRows } from "@/db/client";

type TimestampValue = Date | string;

type AdminProductStatus = "draft" | "published";

type AdminProductSummaryRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  status: AdminProductStatus;
  is_featured: boolean;
  category_count: number;
  variant_count: number;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  status: AdminProductStatus;
  is_featured: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type AdminProductCategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type DeletedProductRow = {
  id: string;
};

type CountRow = {
  matched_count: number;
};

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
};

type CreateAdminProductInput = {
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  status: AdminProductStatus;
  isFeatured: boolean;
  categoryIds: string[];
};

type UpdateAdminProductInput = CreateAdminProductInput & {
  id: string;
};

type RepositoryErrorCode =
  | "slug_taken"
  | "category_missing"
  | "product_referenced";

export type AdminProductSummary = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  status: AdminProductStatus;
  isFeatured: boolean;
  categoryCount: number;
  variantCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductCategoryAssignment = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProductDetail = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  status: AdminProductStatus;
  isFeatured: boolean;
  categories: AdminProductCategoryAssignment[];
  categoryIds: string[];
  createdAt: string;
  updatedAt: string;
};

export class AdminProductRepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

function isValidProductId(id: string): boolean {
  return /^[0-9]+$/.test(id);
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

function mapAdminProductSummary(
  row: AdminProductSummaryRow
): AdminProductSummary {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    status: row.status,
    isFeatured: row.is_featured,
    categoryCount: row.category_count,
    variantCount: row.variant_count,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapAdminProductDetail(
  row: AdminProductRow,
  categories: AdminProductCategoryAssignment[]
): AdminProductDetail {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    status: row.status,
    isFeatured: row.is_featured,
    categories,
    categoryIds: categories.map((category) => category.id),
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapCategoryAssignment(
  row: AdminProductCategoryRow
): AdminProductCategoryAssignment {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug
  };
}

function mapRepositoryError(error: unknown): never {
  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "products_slug_key"
  ) {
    throw new AdminProductRepositoryError(
      "slug_taken",
      "Product slug already exists."
    );
  }

  if (isPostgreSqlErrorLike(error) && error.code === "23503") {
    throw new AdminProductRepositoryError(
      "product_referenced",
      "Product is still referenced by other records."
    );
  }

  throw error;
}

function normalizeCategoryIds(categoryIds: readonly string[]): string[] {
  return [...new Set(categoryIds)];
}

async function listAssignedCategoriesByProductId(
  client: PoolClient,
  productId: string
): Promise<AdminProductCategoryAssignment[]> {
  const result = await client.query<AdminProductCategoryRow>(
    `
      select
        c.id::text as id,
        c.name,
        c.slug
      from product_categories pc
      join categories c
        on c.id = pc.category_id
      where pc.product_id = $1::bigint
      order by lower(c.name) asc, c.id asc
    `,
    [productId]
  );

  return result.rows.map(mapCategoryAssignment);
}

async function ensureCategoriesExist(
  client: PoolClient,
  categoryIds: readonly string[]
): Promise<string[]> {
  const normalizedCategoryIds = normalizeCategoryIds(categoryIds);

  if (normalizedCategoryIds.length === 0) {
    return [];
  }

  const result = await client.query<CountRow>(
    `
      select count(*)::int as matched_count
      from categories
      where id = any($1::bigint[])
    `,
    [normalizedCategoryIds]
  );

  const matchedCount = result.rows[0]?.matched_count ?? 0;

  if (matchedCount !== normalizedCategoryIds.length) {
    throw new AdminProductRepositoryError(
      "category_missing",
      "At least one selected category does not exist."
    );
  }

  return normalizedCategoryIds;
}

async function replaceProductCategories(
  client: PoolClient,
  productId: string,
  categoryIds: readonly string[]
): Promise<void> {
  await client.query(
    `
      delete from product_categories
      where product_id = $1::bigint
    `,
    [productId]
  );

  if (categoryIds.length === 0) {
    return;
  }

  await client.query(
    `
      insert into product_categories (
        product_id,
        category_id
      )
      select
        $1::bigint,
        unnest($2::bigint[])
    `,
    [productId, categoryIds]
  );
}

export async function listAdminProducts(): Promise<AdminProductSummary[]> {
  const rows = await queryRows<AdminProductSummaryRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.status,
        p.is_featured,
        (
          select count(*)::int
          from product_categories pc
          where pc.product_id = p.id
        ) as category_count,
        (
          select count(*)::int
          from product_variants pv
          where pv.product_id = p.id
        ) as variant_count,
        p.created_at,
        p.updated_at
      from products p
      order by p.created_at desc, p.id desc
    `
  );

  return rows.map(mapAdminProductSummary);
}

export async function findAdminProductById(
  id: string
): Promise<AdminProductDetail | null> {
  if (!isValidProductId(id)) {
    return null;
  }

  const row = await queryFirst<AdminProductRow>(
    `
      select
        p.id::text as id,
        p.name,
        p.slug,
        p.short_description,
        p.description,
        p.status,
        p.is_featured,
        p.created_at,
        p.updated_at
      from products p
      where p.id = $1::bigint
      limit 1
    `,
    [id]
  );

  if (row === null) {
    return null;
  }

  const client = await db.connect();

  try {
    const categories = await listAssignedCategoriesByProductId(client, row.id);

    return mapAdminProductDetail(row, categories);
  } finally {
    client.release();
  }
}

export async function createAdminProduct(
  input: CreateAdminProductInput
): Promise<AdminProductDetail> {
  const client = await db.connect();

  try {
    await client.query("begin");

    const categoryIds = await ensureCategoriesExist(client, input.categoryIds);
    const result = await client.query<AdminProductRow>(
      `
        insert into products (
          name,
          slug,
          short_description,
          description,
          status,
          is_featured
        )
        values ($1, $2, $3, $4, $5, $6)
        returning
          id::text as id,
          name,
          slug,
          short_description,
          description,
          status,
          is_featured,
          created_at,
          updated_at
      `,
      [
        input.name,
        input.slug,
        input.shortDescription,
        input.description,
        input.status,
        input.isFeatured
      ]
    );

    const row = result.rows[0];

    if (!row) {
      throw new Error("Failed to create product.");
    }

    await replaceProductCategories(client, row.id, categoryIds);
    const categories = await listAssignedCategoriesByProductId(client, row.id);

    await client.query("commit");

    return mapAdminProductDetail(row, categories);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}

export async function updateAdminProduct(
  input: UpdateAdminProductInput
): Promise<AdminProductDetail | null> {
  if (!isValidProductId(input.id)) {
    return null;
  }

  const client = await db.connect();

  try {
    await client.query("begin");

    const categoryIds = await ensureCategoriesExist(client, input.categoryIds);
    const result = await client.query<AdminProductRow>(
      `
        update products
        set
          name = $2,
          slug = $3,
          short_description = $4,
          description = $5,
          status = $6,
          is_featured = $7
        where id = $1::bigint
        returning
          id::text as id,
          name,
          slug,
          short_description,
          description,
          status,
          is_featured,
          created_at,
          updated_at
      `,
      [
        input.id,
        input.name,
        input.slug,
        input.shortDescription,
        input.description,
        input.status,
        input.isFeatured
      ]
    );

    const row = result.rows[0];

    if (!row) {
      await client.query("rollback");
      return null;
    }

    await replaceProductCategories(client, row.id, categoryIds);
    const categories = await listAssignedCategoriesByProductId(client, row.id);

    await client.query("commit");

    return mapAdminProductDetail(row, categories);
  } catch (error) {
    await client.query("rollback");

    if (error instanceof AdminProductRepositoryError) {
      throw error;
    }

    mapRepositoryError(error);
  } finally {
    client.release();
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  if (!isValidProductId(id)) {
    return false;
  }

  try {
    const row = await queryFirst<DeletedProductRow>(
      `
        delete from products
        where id = $1::bigint
        returning id::text as id
      `,
      [id]
    );

    return row !== null;
  } catch (error) {
    mapRepositoryError(error);
  }
}
