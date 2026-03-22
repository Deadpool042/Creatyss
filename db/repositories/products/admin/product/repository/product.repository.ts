import { Prisma } from "@prisma/client";
import { prisma } from "@db/prisma-client";
import {
  AdminProductRepositoryError,
  type AdminProductDetail,
  type AdminProductSummary,
  type CreateAdminProductInput,
  type UpdateAdminProductInput,
} from "@db-products/admin/product";
import {
  mapAdminProductDetail,
  mapAdminProductSummary,
} from "@db-products/helpers/mappers/product.mapper";
import {
  normalizeProductSlug,
  parseCreateAdminProductInput,
  parseUpdateAdminProductInput,
} from "@db-products/helpers/validation/product.validation";
import {
  createProductWithCategoriesInTx,
  updateProductWithCategoriesInTx,
} from "@db-products/helpers/transactions/product.transaction";
import {
  findAdminProductRowById,
  findAdminProductRowBySlug,
  listAdminProductRows,
} from "@db-products/queries/product/admin-product.queries";

function mapPrismaProductError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminProductRepositoryError(
      "product_slug_conflict",
      "Un produit avec ce slug existe déjà."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_CATEGORY_INVALID") {
    throw new AdminProductRepositoryError(
      "product_category_invalid",
      "Une ou plusieurs catégories produit sont invalides."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_DIGITAL_DELIVERABLE_REQUIRED") {
    throw new AdminProductRepositoryError(
      "product_digital_deliverable_required",
      "Un produit digital publié doit avoir un livrable principal actif."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_PATTERN_DETAIL_REQUIRED") {
    throw new AdminProductRepositoryError(
      "product_pattern_detail_required",
      "Un produit digital publié doit avoir une fiche patron."
    );
  }

  throw error;
}

export async function listAdminProducts(): Promise<AdminProductSummary[]> {
  const rows = await listAdminProductRows();
  return rows.map(mapAdminProductSummary);
}

export async function findAdminProductById(id: string): Promise<AdminProductDetail | null> {
  const row = await findAdminProductRowById(id);

  if (!row) {
    return null;
  }

  return mapAdminProductDetail(row);
}

export async function findAdminProductBySlug(slug: string): Promise<AdminProductDetail | null> {
  const normalizedSlug = normalizeProductSlug(slug);
  const row = await findAdminProductRowBySlug(normalizedSlug);

  if (!row) {
    return null;
  }

  return mapAdminProductDetail(row);
}

export async function createAdminProduct(
  input: CreateAdminProductInput
): Promise<AdminProductDetail> {
  const parsedInput = parseCreateAdminProductInput(input);
  const normalizedInput: CreateAdminProductInput = {
    ...parsedInput,
    slug: normalizeProductSlug(parsedInput.slug),
  };

  try {
    const productId = await prisma.$transaction((tx) =>
      createProductWithCategoriesInTx(tx, normalizedInput)
    );

    const row = await findAdminProductRowById(productId);

    if (!row) {
      throw new AdminProductRepositoryError("product_not_found", "Produit introuvable.");
    }

    return mapAdminProductDetail(row);
  } catch (error) {
    mapPrismaProductError(error);
  }
}

export async function updateAdminProduct(
  input: UpdateAdminProductInput
): Promise<AdminProductDetail | null> {
  const parsedInput = parseUpdateAdminProductInput(input);
  const normalizedInput: UpdateAdminProductInput = {
    ...parsedInput,
    slug: normalizeProductSlug(parsedInput.slug),
  };

  try {
    const updated = await prisma.$transaction((tx) =>
      updateProductWithCategoriesInTx(tx, normalizedInput)
    );

    if (!updated) {
      return null;
    }

    const row = await findAdminProductRowById(normalizedInput.id);

    if (!row) {
      return null;
    }

    return mapAdminProductDetail(row);
  } catch (error) {
    mapPrismaProductError(error);
  }
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const deleted = await prisma.product.deleteMany({
    where: { id },
  });

  return deleted.count > 0;
}
