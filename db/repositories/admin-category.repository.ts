import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";

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

type AdminCategoryRepresentativeImage = NonNullable<AdminCategory["representativeImage"]>;

type RepresentativeImageCandidate = {
  productId: bigint;
  createdAt: Date;
  representativeImage: AdminCategoryRepresentativeImage;
};

function sortCategoriesForAdmin(rows: readonly PrismaCategoryData[]): PrismaCategoryData[] {
  return [...rows].sort((a, b) => {
    const nameCompare = a.name.toLowerCase().localeCompare(b.name.toLowerCase());

    if (nameCompare !== 0) {
      return nameCompare;
    }

    if (a.id < b.id) {
      return -1;
    }

    if (a.id > b.id) {
      return 1;
    }

    return 0;
  });
}

function isRepresentativeImageCandidateBetter(
  candidate: RepresentativeImageCandidate,
  current: RepresentativeImageCandidate
): boolean {
  const candidateTime = candidate.createdAt.getTime();
  const currentTime = current.createdAt.getTime();

  if (candidateTime !== currentTime) {
    return candidateTime > currentTime;
  }

  return candidate.productId > current.productId;
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

async function loadRepresentativeImagesByCategoryIds(
  categoryIds: readonly string[]
): Promise<Map<string, AdminCategory["representativeImage"]>> {
  const representativeImagesByCategoryId = new Map<
    string,
    AdminCategory["representativeImage"]
  >();

  if (categoryIds.length === 0) {
    return representativeImagesByCategoryId;
  }

  const categoryIdValues = categoryIds.map((categoryId) => BigInt(categoryId));

  const productLinks = await prisma.product_categories.findMany({
    where: { category_id: { in: categoryIdValues } },
    select: { category_id: true, product_id: true },
  });

  if (productLinks.length === 0) {
    for (const categoryId of categoryIds) {
      representativeImagesByCategoryId.set(categoryId, null);
    }

    return representativeImagesByCategoryId;
  }

  const productIds = [...new Set(productLinks.map((link) => link.product_id.toString()))].map(
    (productId) => BigInt(productId)
  );

  const publishedProducts = await prisma.products.findMany({
    where: {
      id: { in: productIds },
      status: "published",
    },
    select: { id: true, created_at: true },
  });

  if (publishedProducts.length === 0) {
    for (const categoryId of categoryIds) {
      representativeImagesByCategoryId.set(categoryId, null);
    }

    return representativeImagesByCategoryId;
  }

  const publishedProductIds = publishedProducts.map((product) => product.id);
  const primaryProductImages = await prisma.product_images.findMany({
    where: {
      product_id: { in: publishedProductIds },
      is_primary: true,
      variant_id: null,
    },
    select: { product_id: true, file_path: true, alt_text: true },
  });

  const imageByProductId = new Map<string, AdminCategoryRepresentativeImage>();

  for (const image of primaryProductImages) {
    imageByProductId.set(image.product_id.toString(), {
      filePath: image.file_path,
      altText: image.alt_text,
    });
  }

  const candidateByProductId = new Map<string, RepresentativeImageCandidate>();

  for (const product of publishedProducts) {
    const representativeImage = imageByProductId.get(product.id.toString());

    if (representativeImage === undefined) {
      continue;
    }

    candidateByProductId.set(product.id.toString(), {
      productId: product.id,
      createdAt: product.created_at,
      representativeImage,
    });
  }

  const bestCandidateByCategoryId = new Map<string, RepresentativeImageCandidate>();

  for (const link of productLinks) {
    const categoryId = link.category_id.toString();
    const candidate = candidateByProductId.get(link.product_id.toString());

    if (candidate === undefined) {
      continue;
    }

    const current = bestCandidateByCategoryId.get(categoryId);

    if (
      current === undefined ||
      isRepresentativeImageCandidateBetter(candidate, current)
    ) {
      bestCandidateByCategoryId.set(categoryId, candidate);
    }
  }

  for (const categoryId of categoryIds) {
    representativeImagesByCategoryId.set(
      categoryId,
      bestCandidateByCategoryId.get(categoryId)?.representativeImage ?? null
    );
  }

  return representativeImagesByCategoryId;
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
