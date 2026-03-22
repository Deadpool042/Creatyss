import { z } from "zod";
import {
  AdminCategoryRepositoryError,
  type CreateAdminCategoryInput,
  type UpdateAdminCategoryInput,
} from "../admin-category.types";
import { CategoryRepositoryError } from "../category.types";

const categoryStatusSchema = z.enum(["active", "hidden"]);
const idSchema = z.string().trim().min(1);
const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const nameSchema = z.string().trim().min(1);
const mediaIdSchema = z.string().trim().min(1);
const displayOrderSchema = z.number().int().min(0);

const createAdminCategoryInputSchema = z.object({
  slug: slugSchema,
  name: nameSchema,
  description: z.string().trim().nullable().optional(),
  status: categoryStatusSchema.optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: displayOrderSchema.optional(),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  representativeMediaId: mediaIdSchema.nullable().optional(),
});

const updateAdminCategoryInputSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  name: nameSchema,
  description: z.string().trim().nullable().optional(),
  status: categoryStatusSchema.optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: displayOrderSchema.optional(),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  representativeMediaId: mediaIdSchema.nullable().optional(),
});

export function normalizeCategorySlug(value: string): string {
  return value.trim().toLowerCase();
}

export function assertValidCategoryId(id: string): void {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    throw new CategoryRepositoryError("category_not_found", "Catégorie introuvable.");
  }
}

export function parseCreateAdminCategoryInput(
  input: CreateAdminCategoryInput
): CreateAdminCategoryInput {
  const result = createAdminCategoryInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "slug":
        throw new AdminCategoryRepositoryError(
          "category_slug_invalid",
          "Le slug de catégorie est invalide."
        );
      case "name":
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Le nom de catégorie est invalide."
        );
      case "displayOrder":
        throw new AdminCategoryRepositoryError(
          "category_display_order_invalid",
          "L'ordre d'affichage est invalide."
        );
      case "representativeMediaId":
        throw new AdminCategoryRepositoryError(
          "category_media_invalid",
          "L'image de catégorie est invalide."
        );
      default:
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Les données de catégorie sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminCategoryInput = {
    slug: data.slug,
    name: data.name,
  };

  if (data.description !== undefined) parsed.description = data.description;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.isFeatured !== undefined) parsed.isFeatured = data.isFeatured;
  if (data.displayOrder !== undefined) parsed.displayOrder = data.displayOrder;
  if (data.seoTitle !== undefined) parsed.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }
  if (data.representativeMediaId !== undefined) {
    parsed.representativeMediaId = data.representativeMediaId;
  }

  return parsed;
}

export function parseUpdateAdminCategoryInput(
  input: UpdateAdminCategoryInput
): UpdateAdminCategoryInput {
  const result = updateAdminCategoryInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminCategoryRepositoryError("category_not_found", "Catégorie introuvable.");
      case "slug":
        throw new AdminCategoryRepositoryError(
          "category_slug_invalid",
          "Le slug de catégorie est invalide."
        );
      case "name":
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Le nom de catégorie est invalide."
        );
      case "displayOrder":
        throw new AdminCategoryRepositoryError(
          "category_display_order_invalid",
          "L'ordre d'affichage est invalide."
        );
      case "representativeMediaId":
        throw new AdminCategoryRepositoryError(
          "category_media_invalid",
          "L'image de catégorie est invalide."
        );
      default:
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Les données de catégorie sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: UpdateAdminCategoryInput = {
    id: data.id,
    slug: data.slug,
    name: data.name,
  };

  if (data.description !== undefined) parsed.description = data.description;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.isFeatured !== undefined) parsed.isFeatured = data.isFeatured;
  if (data.displayOrder !== undefined) parsed.displayOrder = data.displayOrder;
  if (data.seoTitle !== undefined) parsed.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }
  if (data.representativeMediaId !== undefined) {
    parsed.representativeMediaId = data.representativeMediaId;
  }

  return parsed;
}
