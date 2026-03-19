import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";

// --- Internal types ---

// pg may return Date or string for timestamp columns depending on driver configuration
// (kept for AdminCategoryRow used by $queryRaw reads)
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

// Type structurel interne aligné sur ce que Prisma retourne pour categories (sans relations)
type PrismaCategoryData = {
  id: bigint;
  name: string;
  slug: string;
  description: string | null;
  is_featured: boolean;
  image_path: string | null;
  created_at: Date;
  updated_at: Date;
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

// --- Public types ---

import { AdminCategoryRepositoryError, type AdminCategory } from "./admin-category.types";
export { AdminCategoryRepositoryError };
export type { AdminCategory };

// --- Internal helpers ---

function isValidCategoryId(id: string): boolean {
  return /^[0-9]+$/.test(id);
}

function toIsoTimestamp(value: TimestampValue): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return new Date(value).toISOString();
}

// Mapper for $queryRaw read results (includes representativeImage from lateral join)
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

// Mapper for Prisma mutation results
// representativeImage is null: mutations do not perform the LEFT JOIN LATERAL
function mapPrismaCategoryToPublic(row: PrismaCategoryData): AdminCategory {
  return {
    id: row.id.toString(),
    name: row.name,
    slug: row.slug,
    description: row.description,
    isFeatured: row.is_featured,
    imagePath: row.image_path,
    representativeImage: null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

// $queryRaw requis : LEFT JOIN LATERAL n'est pas supporté par Prisma ORM.
// Toute réécriture Prisma de cette requête modifierait le contrat fonctionnel
// (représentative image sélectionnée par critère LATERAL, non par include simple).
// Revoir si Prisma ajoute le support natif LATERAL.
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

// Absorbs known Prisma errors and maps them to public domain errors.
// P2002: unique constraint violation — categories has only one unique constraint (slug)
// P2003: foreign key constraint violation — category still referenced
function mapPrismaRepositoryError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new AdminCategoryRepositoryError("slug_taken", "Category slug already exists.");
    }

    if (error.code === "P2003") {
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
    const row = await prisma.categories.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        is_featured: input.isFeatured,
      },
    });

    return mapPrismaCategoryToPublic(row);
  } catch (error) {
    mapPrismaRepositoryError(error);
  }
}

export async function updateAdminCategory(
  input: UpdateAdminCategoryInput
): Promise<AdminCategory | null> {
  if (!isValidCategoryId(input.id)) {
    return null;
  }

  try {
    const row = await prisma.categories.update({
      where: { id: BigInt(input.id) },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        is_featured: input.isFeatured,
      },
    });

    return mapPrismaCategoryToPublic(row);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null;
    }

    mapPrismaRepositoryError(error);
  }
}

export async function deleteAdminCategory(id: string): Promise<boolean> {
  if (!isValidCategoryId(id)) {
    return false;
  }

  try {
    await prisma.categories.delete({ where: { id: BigInt(id) } });

    return true;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return false;
    }

    mapPrismaRepositoryError(error);
  }
}

export async function updateAdminCategoryImage(
  input: UpdateAdminCategoryImageInput
): Promise<AdminCategory | null> {
  if (!isValidCategoryId(input.id)) {
    return null;
  }

  try {
    const row = await prisma.categories.update({
      where: { id: BigInt(input.id) },
      data: { image_path: input.imagePath },
    });

    return mapPrismaCategoryToPublic(row);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return null;
    }

    mapPrismaRepositoryError(error);
  }
}

export async function countProductsForCategory(id: string): Promise<number> {
  if (!isValidCategoryId(id)) {
    return 0;
  }

  return prisma.product_categories.count({
    where: { category_id: BigInt(id) },
  });
}
