import { prisma } from "@db/prisma-client";

import { mapAdminProductImageSummary } from "@db-products/helpers/mappers";
import {
  parseCreateAdminProductImageInput,
  parseUpdateAdminProductImageInput,
} from "@db-products/helpers/validation";
import { createProductImageInTx, updateProductImageInTx } from "@db-products/helpers/transactions";
import {
  findAdminProductImageRowById,
  findAdminProductVariantImageRowById,
  listAdminProductImageRowsByProductId,
  listAdminVariantImageRowsByVariantId,
} from "@db-products/queries/image";
import {
  AdminProductImageRepositoryError,
  type CreateAdminProductImageInput,
  type UpdateAdminProductImageInput,
  type AdminProductImageSummary,
} from "@db-products/admin/image";

function mapProductImageTransactionError(error: unknown): never {
  if (error instanceof Error && error.message === "PRODUCT_IMAGE_MEDIA_INVALID") {
    throw new AdminProductImageRepositoryError(
      "product_image_media_invalid",
      "Le média de l'image produit est invalide."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_IMAGE_SCOPE_INVALID") {
    throw new AdminProductImageRepositoryError(
      "product_image_scope_invalid",
      "Le scope de l'image produit est invalide."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_IMAGE_PRODUCT_NOT_FOUND") {
    throw new AdminProductImageRepositoryError(
      "product_image_product_not_found",
      "Produit introuvable pour cette image."
    );
  }

  if (error instanceof Error && error.message === "PRODUCT_IMAGE_VARIANT_NOT_FOUND") {
    throw new AdminProductImageRepositoryError(
      "product_image_variant_not_found",
      "Variante introuvable pour cette image."
    );
  }

  throw error;
}

export async function findAdminProductImageById(
  id: string
): Promise<AdminProductImageSummary | null> {
  const productRow = await findAdminProductImageRowById(id);

  if (productRow) {
    return mapAdminProductImageSummary(productRow);
  }

  const variantRow = await findAdminProductVariantImageRowById(id);

  if (!variantRow) {
    return null;
  }

  return mapAdminProductImageSummary(variantRow);
}

export async function listAdminProductImagesByProductId(
  productId: string
): Promise<AdminProductImageSummary[]> {
  const rows = await listAdminProductImageRowsByProductId(productId);
  return rows.map(mapAdminProductImageSummary);
}

export async function listAdminVariantImagesByVariantId(
  productVariantId: string
): Promise<AdminProductImageSummary[]> {
  const rows = await listAdminVariantImageRowsByVariantId(productVariantId);
  return rows.map(mapAdminProductImageSummary);
}

export async function createAdminProductImage(
  input: CreateAdminProductImageInput
): Promise<AdminProductImageSummary> {
  const parsedInput = parseCreateAdminProductImageInput(input);

  try {
    const imageId = await prisma.$transaction((tx) => createProductImageInTx(tx, parsedInput));

    const created = await findAdminProductImageById(imageId);

    if (!created) {
      throw new AdminProductImageRepositoryError(
        "product_image_not_found",
        "Image produit introuvable."
      );
    }

    return created;
  } catch (error) {
    mapProductImageTransactionError(error);
  }
}

export async function updateAdminProductImage(
  input: UpdateAdminProductImageInput
): Promise<AdminProductImageSummary | null> {
  const parsedInput = parseUpdateAdminProductImageInput(input);

  try {
    const updated = await prisma.$transaction((tx) => updateProductImageInTx(tx, parsedInput));

    if (!updated) {
      return null;
    }

    return findAdminProductImageById(parsedInput.id);
  } catch (error) {
    mapProductImageTransactionError(error);
  }
}

export async function deleteAdminProductImage(id: string): Promise<boolean> {
  const deletedProductImage = await prisma.productImage.deleteMany({
    where: { id },
  });

  if (deletedProductImage.count > 0) {
    return true;
  }

  const deletedVariantImage = await prisma.productVariantImage.deleteMany({
    where: { id },
  });

  return deletedVariantImage.count > 0;
}
