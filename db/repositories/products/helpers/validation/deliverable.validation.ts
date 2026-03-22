import { z } from "zod";
import {
  AdminProductDeliverableRepositoryError,
  type CreateAdminProductDeliverableInput,
  type UpdateAdminProductDeliverableInput,
} from "@db-products/admin/deliverable";

const idSchema = z.string().trim().min(1);
const nameSchema = z.string().trim().min(1);
const sortOrderSchema = z.number().int().min(0);

const productDeliverableKindSchema = z.enum([
  "pattern_pdf",
  "supply_list_pdf",
  "instruction_pdf",
  "bonus_file",
]);

const createAdminProductDeliverableInputSchema = z.object({
  productId: idSchema,
  mediaAssetId: idSchema,
  name: nameSchema,
  kind: productDeliverableKindSchema,
  isPrimary: z.boolean().optional(),
  sortOrder: sortOrderSchema.optional(),
  requiresPurchase: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

const updateAdminProductDeliverableInputSchema = z.object({
  id: idSchema,
  name: nameSchema,
  kind: productDeliverableKindSchema,
  isPrimary: z.boolean().optional(),
  sortOrder: sortOrderSchema.optional(),
  requiresPurchase: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export function parseCreateAdminProductDeliverableInput(
  input: CreateAdminProductDeliverableInput
): CreateAdminProductDeliverableInput {
  const result = createAdminProductDeliverableInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "productId":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_product_not_found",
          "Produit du livrable introuvable."
        );
      case "mediaAssetId":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_media_invalid",
          "Média du livrable invalide."
        );
      case "name":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_name_invalid",
          "Nom du livrable invalide."
        );
      case "kind":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_kind_invalid",
          "Type de livrable invalide."
        );
      case "sortOrder":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_sort_order_invalid",
          "Ordre du livrable invalide."
        );
      default:
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_name_invalid",
          "Les données du livrable sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminProductDeliverableInput = {
    productId: data.productId,
    mediaAssetId: data.mediaAssetId,
    name: data.name,
    kind: data.kind,
  };

  if (data.isPrimary !== undefined) parsed.isPrimary = data.isPrimary;
  if (data.sortOrder !== undefined) parsed.sortOrder = data.sortOrder;
  if (data.requiresPurchase !== undefined) {
    parsed.requiresPurchase = data.requiresPurchase;
  }
  if (data.isActive !== undefined) parsed.isActive = data.isActive;

  return parsed;
}

export function parseUpdateAdminProductDeliverableInput(
  input: UpdateAdminProductDeliverableInput
): UpdateAdminProductDeliverableInput {
  const result = updateAdminProductDeliverableInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_not_found",
          "Livrable introuvable."
        );
      case "name":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_name_invalid",
          "Nom du livrable invalide."
        );
      case "kind":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_kind_invalid",
          "Type de livrable invalide."
        );
      case "sortOrder":
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_sort_order_invalid",
          "Ordre du livrable invalide."
        );
      default:
        throw new AdminProductDeliverableRepositoryError(
          "product_deliverable_name_invalid",
          "Les données du livrable sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: UpdateAdminProductDeliverableInput = {
    id: data.id,
    name: data.name,
    kind: data.kind,
  };

  if (data.isPrimary !== undefined) parsed.isPrimary = data.isPrimary;
  if (data.sortOrder !== undefined) parsed.sortOrder = data.sortOrder;
  if (data.requiresPurchase !== undefined) {
    parsed.requiresPurchase = data.requiresPurchase;
  }
  if (data.isActive !== undefined) parsed.isActive = data.isActive;

  return parsed;
}
