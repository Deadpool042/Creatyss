import { queryFirst, queryRows } from "@/db/client";

type TimestampValue = Date | string;

type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_featured: boolean;
  created_at: TimestampValue;
  updated_at: TimestampValue;
};

type ProductCountRow = {
  product_count: number;
};

type DeletedCategoryRow = {
  id: string;
};

type CreateAdminCategoryInput = {
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
};

type UpdateAdminCategoryInput = CreateAdminCategoryInput & {
  id: string;
};

type RepositoryErrorCode = "slug_taken" | "category_referenced";

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export class AdminCategoryRepositoryError extends Error {
  readonly code: RepositoryErrorCode;

  constructor(code: RepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

function isValidCategoryId(id: string): boolean {
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

function mapAdminCategory(row: AdminCategoryRow): AdminCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    isFeatured: row.is_featured,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at)
  };
}

function mapRepositoryError(error: unknown): never {
  if (
    isPostgreSqlErrorLike(error) &&
    error.code === "23505" &&
    error.constraint === "categories_slug_key"
  ) {
    throw new AdminCategoryRepositoryError(
      "slug_taken",
      "Category slug already exists."
    );
  }

  if (isPostgreSqlErrorLike(error) && error.code === "23503") {
    throw new AdminCategoryRepositoryError(
      "category_referenced",
      "Category is still referenced by other records."
    );
  }

  throw error;
}

export async function listAdminCategories(): Promise<AdminCategory[]> {
  const rows = await queryRows<AdminCategoryRow>(
    `
      select
        id::text as id,
        name,
        slug,
        description,
        is_featured,
        created_at,
        updated_at
      from categories
      order by lower(name) asc, id asc
    `
  );

  return rows.map(mapAdminCategory);
}

export async function findAdminCategoryById(
  id: string
): Promise<AdminCategory | null> {
  if (!isValidCategoryId(id)) {
    return null;
  }

  const row = await queryFirst<AdminCategoryRow>(
    `
      select
        id::text as id,
        name,
        slug,
        description,
        is_featured,
        created_at,
        updated_at
      from categories
      where id = $1::bigint
      limit 1
    `,
    [id]
  );

  if (row === null) {
    return null;
  }

  return mapAdminCategory(row);
}

export async function createAdminCategory(
  input: CreateAdminCategoryInput
): Promise<AdminCategory> {
  try {
    const row = await queryFirst<AdminCategoryRow>(
      `
        insert into categories (
          name,
          slug,
          description,
          is_featured
        )
        values ($1, $2, $3, $4)
        returning
          id::text as id,
          name,
          slug,
          description,
          is_featured,
          created_at,
          updated_at
      `,
      [input.name, input.slug, input.description, input.isFeatured]
    );

    if (row === null) {
      throw new Error("Failed to create category.");
    }

    return mapAdminCategory(row);
  } catch (error) {
    mapRepositoryError(error);
  }
}

export async function updateAdminCategory(
  input: UpdateAdminCategoryInput
): Promise<AdminCategory | null> {
  if (!isValidCategoryId(input.id)) {
    return null;
  }

  try {
    const row = await queryFirst<AdminCategoryRow>(
      `
        update categories
        set
          name = $2,
          slug = $3,
          description = $4,
          is_featured = $5
        where id = $1::bigint
        returning
          id::text as id,
          name,
          slug,
          description,
          is_featured,
          created_at,
          updated_at
      `,
      [
        input.id,
        input.name,
        input.slug,
        input.description,
        input.isFeatured
      ]
    );

    if (row === null) {
      return null;
    }

    return mapAdminCategory(row);
  } catch (error) {
    mapRepositoryError(error);
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  if (!isValidCategoryId(id)) {
    return false;
  }

  try {
    const row = await queryFirst<DeletedCategoryRow>(
      `
        delete from categories
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

export async function countProductsForCategory(id: string): Promise<number> {
  if (!isValidCategoryId(id)) {
    return 0;
  }

  const row = await queryFirst<ProductCountRow>(
    `
      select count(*)::int as product_count
      from product_categories
      where category_id = $1::bigint
    `,
    [id]
  );

  return row?.product_count ?? 0;
}
