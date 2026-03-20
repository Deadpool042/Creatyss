import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import { sortCategoriesForAdmin } from "./admin-category/helpers/sort";
import { loadRepresentativeImagesByCategoryIds } from "./admin-category/queries/representative-image.queries";

// --- Internal types ---

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

function mapPrismaCategoryToPublic(
  row: PrismaCategoryData,
  representativeImage: AdminCategory["representativeImage"] = null
): AdminCategory {
  return {
    id: row.id.toString(),
    name: row.name,
    slug: row.slug,
    description: row.description,
    isFeatured: row.is_featured,
    imagePath: row.image_path,
    representativeImage,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

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
  const categories = sortCategoriesForAdmin(await prisma.categories.findMany());
  const representativeImagesByCategoryId = await loadRepresentativeImagesByCategoryIds(
    categories.map((category) => category.id.toString())
  );

  return categories.map((category) =>
    mapPrismaCategoryToPublic(
      category,
      representativeImagesByCategoryId.get(category.id.toString()) ?? null
    )
  );
}

export async function findAdminCategoryById(id: string): Promise<AdminCategory | null> {
  if (!isValidCategoryId(id)) {
    return null;
  }

  const category = await prisma.categories.findUnique({
    where: { id: BigInt(id) },
  });

  if (category === null) {
    return null;
  }

  const representativeImagesByCategoryId = await loadRepresentativeImagesByCategoryIds([id]);

  return mapPrismaCategoryToPublic(category, representativeImagesByCategoryId.get(id) ?? null);
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
