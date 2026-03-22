import { z } from "zod";
import {
  AdminProductImageRepositoryError,
  type CreateAdminProductImageInput,
  type UpdateAdminProductImageInput,
} from "@db-products/admin/image";

const idSchema = z.string().trim().min(1);
const sortOrderSchema = z.number().int().min(0);

const createAdminProductImageInputSchema = z.object({
  productId: idSchema.nullable().optional(),
  productVariantId: idSchema.nullable().optional(),
  mediaAssetId: idSchema,
  isPrimary: z.boolean().optional(),
  sortOrder: sortOrderSchema.optional(),
});

const updateAdminProductImageInputSchema = z.object({
  id: idSchema,
  isPrimary: z.boolean().optional(),
  sortOrder: sortOrderSchema.optional(),
});

export function parseCreateAdminProductImageInput(
  input: CreateAdminProductImageInput
): CreateAdminProductImageInput {
  const result = createAdminProductImageInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "mediaAssetId":
        throw new AdminProductImageRepositoryError(
          "product_image_media_invalid",
          "Le média produit est invalide."
        );
      case "productId":
      case "productVariantId":
        throw new AdminProductImageRepositoryError(
          "product_image_scope_invalid",
          "Le scope de l'image produit est invalide."
        );
      default:
        throw new AdminProductImageRepositoryError(
          "product_image_scope_invalid",
          "Les données de l'image produit sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminProductImageInput = {
    mediaAssetId: data.mediaAssetId,
  };

  if (data.productId !== undefined) parsed.productId = data.productId;
  if (data.productVariantId !== undefined) {
    parsed.productVariantId = data.productVariantId;
  }
  if (data.isPrimary !== undefined) parsed.isPrimary = data.isPrimary;
  if (data.sortOrder !== undefined) parsed.sortOrder = data.sortOrder;

  return parsed;
}

export function parseUpdateAdminProductImageInput(
  input: UpdateAdminProductImageInput
): UpdateAdminProductImageInput {
  const result = updateAdminProductImageInputSchema.safeParse(input);

  if (!result.success) {
    throw new AdminProductImageRepositoryError(
      "product_image_not_found",
      "Image produit introuvable."
    );
  }

  const data = result.data;
  const parsed: UpdateAdminProductImageInput = {
    id: data.id,
  };

  if (data.isPrimary !== undefined) {
    parsed.isPrimary = data.isPrimary;
  }

  if (data.sortOrder !== undefined) {
    parsed.sortOrder = data.sortOrder;
  }

  return parsed;
}
