import { z } from "zod";
import { CategoryRepositoryError } from "@db-categories/public";
import { AdminCategoryRepositoryError } from "@db-categories/admin";
import type {
  CreateAdminCategoryInput,
  UpdateAdminCategoryInput,
} from "@db-categories/admin/types/category.types";

const categoryStatusSchema = z.enum(["draft", "active", "archived"]);
const categoryIdSchema = z.string().trim().min(1);
const nonEmptyStringSchema = z.string().trim().min(1);
const optionalNullableTrimmedStringSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined) {
      return undefined;
    }

    return value || null;
  });
const createAdminCategoryInputSchema = z.object({
  storeId: nonEmptyStringSchema,
  parentId: optionalNullableTrimmedStringSchema,
  slug: z.string(),
  name: nonEmptyStringSchema,
  description: optionalNullableTrimmedStringSchema,
  status: categoryStatusSchema.optional(),
  sortOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
});
const updateAdminCategoryInputSchema = z.object({
  id: categoryIdSchema,
  parentId: optionalNullableTrimmedStringSchema,
  slug: z.string().optional(),
  name: nonEmptyStringSchema.optional(),
  description: optionalNullableTrimmedStringSchema,
  status: categoryStatusSchema.optional(),
  sortOrder: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
});
type ParsedCreateAdminCategoryInput = {
  storeId: string;
  parentId?: string | null;
  slug: string;
  name: string;
  description: string | null;
  status: NonNullable<CreateAdminCategoryInput["status"]>;
  sortOrder: number;
  isFeatured: boolean;
};
type ParsedUpdateAdminCategoryInput = {
  id: string;
  parentId?: string | null;
  slug?: string;
  name?: string;
  description?: string | null;
  status?: UpdateAdminCategoryInput["status"];
  sortOrder?: number;
  isFeatured?: boolean;
};

export function assertValidCategoryId(id: string): string {
  const result = categoryIdSchema.safeParse(id);

  if (!result.success) {
    throw new CategoryRepositoryError("category_id_invalid", "Identifiant de catégorie invalide.");
  }

  return result.data;
}

export function normalizeCategorySlug(slug: string): string {
  const result = nonEmptyStringSchema.safeParse(slug);

  if (!result.success) {
    throw new AdminCategoryRepositoryError(
      "category_slug_invalid",
      "Slug de catégorie invalide."
    );
  }

  const normalizedSlug = result.data
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!normalizedSlug) {
    throw new AdminCategoryRepositoryError(
      "category_slug_invalid",
      "Slug de catégorie invalide."
    );
  }

  return normalizedSlug;
}

export function parseCreateAdminCategoryInput(
  input: CreateAdminCategoryInput
): ParsedCreateAdminCategoryInput {
  const result = createAdminCategoryInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "storeId":
        throw new AdminCategoryRepositoryError(
          "category_store_invalid",
          "Boutique de catégorie invalide."
        );
      case "slug":
        throw new AdminCategoryRepositoryError(
          "category_slug_invalid",
          "Slug de catégorie invalide."
        );
      case "name":
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Nom de catégorie invalide."
        );
      case "sortOrder":
        throw new AdminCategoryRepositoryError(
          "category_sort_order_invalid",
          "Ordre de catégorie invalide."
        );
      case "status":
        throw new AdminCategoryRepositoryError(
          "category_status_invalid",
          "Statut de catégorie invalide."
        );
      default:
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Les données de catégorie sont invalides."
        );
    }
  }

  const parsedInput: ParsedCreateAdminCategoryInput = {
    storeId: result.data.storeId,
    slug: normalizeCategorySlug(result.data.slug),
    name: result.data.name,
    description: result.data.description ?? null,
    status: result.data.status ?? "draft",
    sortOrder: result.data.sortOrder ?? 0,
    isFeatured: result.data.isFeatured ?? false,
  };

  if (result.data.parentId !== undefined) {
    parsedInput.parentId = result.data.parentId;
  }

  return parsedInput;
}

export function parseUpdateAdminCategoryInput(
  input: UpdateAdminCategoryInput
): ParsedUpdateAdminCategoryInput {
  const result = updateAdminCategoryInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminCategoryRepositoryError(
          "category_id_invalid",
          "Identifiant de catégorie invalide."
        );
      case "slug":
        throw new AdminCategoryRepositoryError(
          "category_slug_invalid",
          "Slug de catégorie invalide."
        );
      case "name":
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Nom de catégorie invalide."
        );
      case "sortOrder":
        throw new AdminCategoryRepositoryError(
          "category_sort_order_invalid",
          "Ordre de catégorie invalide."
        );
      case "status":
        throw new AdminCategoryRepositoryError(
          "category_status_invalid",
          "Statut de catégorie invalide."
        );
      default:
        throw new AdminCategoryRepositoryError(
          "category_name_invalid",
          "Les données de catégorie sont invalides."
        );
    }
  }

  const parsedInput: ParsedUpdateAdminCategoryInput = {
    id: result.data.id,
  };

  if (result.data.parentId !== undefined) {
    parsedInput.parentId = result.data.parentId;
  }

  if (result.data.slug !== undefined) {
    parsedInput.slug = normalizeCategorySlug(result.data.slug);
  }

  if (result.data.name !== undefined) {
    parsedInput.name = result.data.name;
  }

  if (result.data.description !== undefined) {
    parsedInput.description = result.data.description;
  }

  if (result.data.status !== undefined) {
    parsedInput.status = result.data.status;
  }

  if (result.data.sortOrder !== undefined) {
    parsedInput.sortOrder = result.data.sortOrder;
  }

  if (result.data.isFeatured !== undefined) {
    parsedInput.isFeatured = result.data.isFeatured;
  }

  return parsedInput;
}
