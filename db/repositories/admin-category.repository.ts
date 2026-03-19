import { Prisma } from "@prisma/client";
import { queryFirst } from "@/db/client";
import { prisma } from "@/db/prisma-client";

// --- Internal types ---

// pg may return Date or string for timestamp columns depending on driver configuration
type TimestampValue = Date | string;

type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_featured: boolean;
  image_path: string | null;
  created_at: TimestampValue;
  updated_at: TimestampValue;
  // Present only when fetched via the lateral-join read queries
  rep_image_file_path?: string | null;
  rep_image_alt_text?: string | null;
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

type UpdateAdminCategoryImageInput = {
  id: string;
  imagePath: string | null;
};

type UpdateAdminCategoryInput = CreateAdminCategoryInput & {
  id: string;
};

type RepositoryErrorCode = "slug_taken" | "category_referenced";

type PostgreSqlErrorLike = Error & {
  code: string;
  constraint?: string;
};

// --- Public types ---

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isFeatured: boolean;
  imagePath: string | null;
  representativeImage: { filePath: string; altText: string | null } | null;
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

// --- Internal helpers ---

const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";
const CATEGORY_SLUG_CONSTRAINT = "categories_slug_key";

// Single column list used by all category queries — no summary/detail distinction for this entity
const CATEGORY_COLUMNS =
  "id::text as id, name, slug, description, is_featured, image_path, created_at, updated_at";

function isValidCategoryId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function isPostgreSqlErrorLike(error: unknown): error is PostgreSqlErrorLike {
  return error instanceof Error && typeof (error as { code?: unknown }).code === "string";
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
    imagePath: row.image_path,
    representativeImage:
      row.rep_image_file_path != null
        ? { filePath: row.rep_image_file_path, altText: row.rep_image_alt_text ?? null }
        : null,
    createdAt: toIsoTimestamp(row.created_at),
    updatedAt: toIsoTimestamp(row.updated_at),
  };
}

// Prisma.sql fragment — embedded in $queryRaw calls below
// LEFT JOIN LATERAL: image primaire du produit publié le plus récent dans la catégorie
// Non exprimable proprement via include Prisma (orderBy sur relation imbriquée non supporté)
const REP_IMAGE_LATERAL_SQL = Prisma.sql`
  LEFT JOIN LATERAL (
    SELECT pi.file_path, pi.alt_text
    FROM   product_categories pc
    JOIN   products p        ON p.id  = pc.product_id
    JOIN   product_images pi ON pi.product_id = p.id AND pi.is_primary = true
    WHERE  pc.category_id = c.id
      AND  p.status = 'published'
    ORDER BY p.created_at DESC
    LIMIT 1
  ) rep_img ON TRUE
`;

// Builds the ordered parameter array shared by INSERT and UPDATE queries.
// Create: buildCategoryWriteParams(input)          → $1=name … $4=isFeatured
// Update: [input.id, ...buildCategoryWriteParams(input)] → $1=id, $2=name … $5=isFeatured
function buildCategoryWriteParams(input: CreateAdminCategoryInput): unknown[] {
  return [input.name, input.slug, input.description, input.isFeatured];
}

function mapRepositoryError(error: unknown): never {
  if (isPostgreSqlErrorLike(error)) {
    if (error.code === PG_UNIQUE_VIOLATION && error.constraint === CATEGORY_SLUG_CONSTRAINT) {
      throw new AdminCategoryRepositoryError("slug_taken", "Category slug already exists.");
    }

    if (error.code === PG_FOREIGN_KEY_VIOLATION) {
      throw new AdminCategoryRepositoryError(
        "category_referenced",
        "Category is still referenced by other records."
      );
    }
  }

  throw error;
}

// --- Public functions ---

export async function listAdminCategories(): Promise<AdminCategory[]> {
  const rows = await prisma.$queryRaw<AdminCategoryRow[]>(Prisma.sql`
    SELECT id::text AS id, name, slug, description, is_featured, image_path, created_at, updated_at,
           rep_img.file_path AS rep_image_file_path,
           rep_img.alt_text  AS rep_image_alt_text
    FROM   categories c
    ${REP_IMAGE_LATERAL_SQL}
    ORDER BY lower(c.name) ASC, c.id ASC
  `);

  return rows.map(mapAdminCategory);
}

export async function findAdminCategoryById(id: string): Promise<AdminCategory | null> {
  if (!isValidCategoryId(id)) {
    return null;
  }

  const rows = await prisma.$queryRaw<AdminCategoryRow[]>(Prisma.sql`
    SELECT id::text AS id, name, slug, description, is_featured, image_path, created_at, updated_at,
           rep_img.file_path AS rep_image_file_path,
           rep_img.alt_text  AS rep_image_alt_text
    FROM   categories c
    ${REP_IMAGE_LATERAL_SQL}
    WHERE  c.id = ${BigInt(id)}
    LIMIT  1
  `);

  const row = rows[0] ?? null;
  return row !== null ? mapAdminCategory(row) : null;
}

export async function createAdminCategory(input: CreateAdminCategoryInput): Promise<AdminCategory> {
  try {
    const row = await queryFirst<AdminCategoryRow>(
      `
        insert into categories (name, slug, description, is_featured)
        values ($1, $2, $3, $4)
        returning ${CATEGORY_COLUMNS}
      `,
      buildCategoryWriteParams(input)
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
        returning ${CATEGORY_COLUMNS}
      `,
      [input.id, ...buildCategoryWriteParams(input)]
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

export async function updateAdminCategoryImage(
  input: UpdateAdminCategoryImageInput
): Promise<AdminCategory | null> {
  if (!isValidCategoryId(input.id)) {
    return null;
  }

  const row = await queryFirst<AdminCategoryRow>(
    `
      update categories
      set image_path = $2
      where id = $1::bigint
      returning ${CATEGORY_COLUMNS}
    `,
    [input.id, input.imagePath]
  );

  if (row === null) {
    return null;
  }

  return mapAdminCategory(row);
}

export async function countProductsForCategory(id: string): Promise<number> {
  if (!isValidCategoryId(id)) {
    return 0;
  }

  return prisma.product_categories.count({
    where: { category_id: BigInt(id) },
  });
}
