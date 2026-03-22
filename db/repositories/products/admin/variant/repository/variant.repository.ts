import { Prisma } from "@prisma/client";
import { prisma } from "@db/prisma-client";
import {
  AdminProductVariantRepositoryError,
  type AdminProductVariantDetail,
  type AdminProductVariantSummary,
  type CreateAdminProductVariantInput,
  type UpdateAdminProductVariantInput,
} from "@db-products/admin/variant";
import { AdminProductRepositoryError } from "@db-products/admin/product";
import {
  mapAdminProductVariantDetail,
  mapAdminProductVariantSummary,
} from "@db-products/helpers/mappers";
import {
  parseCreateAdminProductVariantInput,
  parseUpdateAdminProductVariantInput,
} from "@db-products/helpers/validation";
import {
  createProductVariantInTx,
  deleteProductVariantInTx,
  updateProductVariantInTx,
} from "@db-products/helpers/transactions";
import {
  findAdminProductVariantRowById,
  listAdminProductVariantRowsByProductId,
} from "@db-products/queries/variant";

function mapPrismaVariantError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminProductVariantRepositoryError(
      "product_variant_sku_conflict",
      "Une variante avec ce SKU existe déjà."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_VARIANT_PRODUCT_NOT_FOUND") {
    throw new AdminProductVariantRepositoryError(
      "product_variant_product_not_found",
      "Produit de la variante introuvable."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_SIMPLE_VARIANT_MISMATCH") {
    throw new AdminProductRepositoryError(
      "product_simple_variant_mismatch",
      "Impossible de gérer des variantes sur un produit simple."
    );
  }

  throw error;
}

export async function findAdminProductVariantById(
  id: string
): Promise<AdminProductVariantDetail | null> {
  const row = await findAdminProductVariantRowById(id);

  if (!row) {
    return null;
  }

  return mapAdminProductVariantDetail(row);
}

export async function listAdminProductVariantsByProductId(
  productId: string
): Promise<AdminProductVariantSummary[]> {
  const rows = await listAdminProductVariantRowsByProductId(productId);
  return rows.map(mapAdminProductVariantSummary);
}

export async function createAdminProductVariant(
  input: CreateAdminProductVariantInput
): Promise<AdminProductVariantDetail> {
  const parsedInput = parseCreateAdminProductVariantInput(input);

  try {
    const variantId = await prisma.$transaction((tx) => createProductVariantInTx(tx, parsedInput));

    const row = await findAdminProductVariantRowById(variantId);

    if (!row) {
      throw new AdminProductVariantRepositoryError(
        "product_variant_not_found",
        "Variante introuvable."
      );
    }

    return mapAdminProductVariantDetail(row);
  } catch (error) {
    mapPrismaVariantError(error);
  }
}

export async function updateAdminProductVariant(
  input: UpdateAdminProductVariantInput
): Promise<AdminProductVariantDetail | null> {
  const parsedInput = parseUpdateAdminProductVariantInput(input);

  try {
    const updated = await prisma.$transaction((tx) => updateProductVariantInTx(tx, parsedInput));

    if (!updated) {
      return null;
    }

    const row = await findAdminProductVariantRowById(parsedInput.id);

    if (!row) {
      return null;
    }

    return mapAdminProductVariantDetail(row);
  } catch (error) {
    mapPrismaVariantError(error);
  }
}

export async function deleteAdminProductVariant(id: string): Promise<boolean> {
  return prisma.$transaction((tx) => deleteProductVariantInTx(tx, id));
}
