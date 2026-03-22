import { z } from "zod";
import {
  AdminPageRepositoryError,
  type CreateAdminPageInput,
  type UpdateAdminPageInput,
} from "../admin-page.types";

const pageStatusSchema = z.enum(["draft", "published", "archived"]);
const pageTypeSchema = z.enum(["homepage", "standard", "legal", "landing"]);

const pageSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const pageTitleSchema = z.string().trim().min(1);

const pageIdSchema = z.string().trim().min(1);

const pageContentSchema = z
  .unknown()
  .refine((value) => value !== null && value !== undefined, "Le contenu de page est obligatoire.");

const createAdminPageInputSchema = z.object({
  slug: pageSlugSchema,
  title: pageTitleSchema,
  pageType: pageTypeSchema,
  status: pageStatusSchema.optional(),
  summary: z.string().trim().nullable().optional(),
  contentJson: pageContentSchema,
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  isIndexed: z.boolean().optional(),
});

const updateAdminPageInputSchema = z.object({
  id: pageIdSchema,
  slug: pageSlugSchema,
  title: pageTitleSchema,
  pageType: pageTypeSchema,
  status: pageStatusSchema,
  summary: z.string().trim().nullable().optional(),
  contentJson: pageContentSchema,
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  isIndexed: z.boolean(),
});

export function normalizePageSlug(value: string): string {
  return value.trim().toLowerCase();
}

export function assertValidPageId(id: string): void {
  const result = pageIdSchema.safeParse(id);

  if (!result.success) {
    throw new AdminPageRepositoryError("page_not_found", "Page introuvable.");
  }
}

export function parseCreateAdminPageInput(input: CreateAdminPageInput): CreateAdminPageInput {
  const result = createAdminPageInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "slug":
        throw new AdminPageRepositoryError("page_slug_invalid", "Le slug de page est invalide.");
      case "title":
        throw new AdminPageRepositoryError(
          "page_title_invalid",
          "Le titre de page est obligatoire."
        );
      case "contentJson":
        throw new AdminPageRepositoryError(
          "page_content_invalid",
          "Le contenu de page est obligatoire."
        );
      default:
        throw new AdminPageRepositoryError(
          "page_content_invalid",
          "Les données de page sont invalides."
        );
    }
  }

  const data = result.data;

  const parsed: CreateAdminPageInput = {
    slug: data.slug,
    title: data.title,
    pageType: data.pageType,
    contentJson: data.contentJson,
  };

  if (data.status !== undefined) {
    parsed.status = data.status;
  }

  if (data.summary !== undefined) {
    parsed.summary = data.summary;
  }

  if (data.seoTitle !== undefined) {
    parsed.seoTitle = data.seoTitle;
  }

  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }

  if (data.isIndexed !== undefined) {
    parsed.isIndexed = data.isIndexed;
  }

  return parsed;
}

export function parseUpdateAdminPageInput(input: UpdateAdminPageInput): UpdateAdminPageInput {
  const result = updateAdminPageInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminPageRepositoryError("page_not_found", "Page introuvable.");
      case "slug":
        throw new AdminPageRepositoryError("page_slug_invalid", "Le slug de page est invalide.");
      case "title":
        throw new AdminPageRepositoryError(
          "page_title_invalid",
          "Le titre de page est obligatoire."
        );
      case "contentJson":
        throw new AdminPageRepositoryError(
          "page_content_invalid",
          "Le contenu de page est obligatoire."
        );
      default:
        throw new AdminPageRepositoryError(
          "page_content_invalid",
          "Les données de page sont invalides."
        );
    }
  }

  const data = result.data;

  const parsed: UpdateAdminPageInput = {
    id: data.id,
    slug: data.slug,
    title: data.title,
    pageType: data.pageType,
    status: data.status,
    contentJson: data.contentJson,
    isIndexed: data.isIndexed,
  };

  if (data.summary !== undefined) {
    parsed.summary = data.summary;
  }

  if (data.seoTitle !== undefined) {
    parsed.seoTitle = data.seoTitle;
  }

  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }

  return parsed;
}
