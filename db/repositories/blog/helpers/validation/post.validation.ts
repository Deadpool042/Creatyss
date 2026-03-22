import { z } from "zod";
import {
  AdminBlogRepositoryError,
  type CreateAdminBlogPostInput,
  type UpdateAdminBlogPostInput,
} from "@db-blog/admin/post";
import { BlogRepositoryError } from "@db-blog/public/post";

const blogPostStatusSchema = z.enum(["draft", "published", "archived"]);
const idSchema = z.string().trim().min(1);
const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const titleSchema = z.string().trim().min(1);
const contentSchema = z.string().trim().min(1);

const createAdminBlogPostInputSchema = z.object({
  slug: slugSchema,
  title: titleSchema,
  excerpt: z.string().trim().nullable().optional(),
  content: contentSchema,
  status: blogPostStatusSchema.optional(),
  coverMediaId: idSchema.nullable().optional(),
  publishedAt: z.date().nullable().optional(),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
});

const updateAdminBlogPostInputSchema = z.object({
  id: idSchema,
  slug: slugSchema,
  title: titleSchema,
  excerpt: z.string().trim().nullable().optional(),
  content: contentSchema,
  status: blogPostStatusSchema.optional(),
  coverMediaId: idSchema.nullable().optional(),
  publishedAt: z.date().nullable().optional(),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
});

export function normalizeBlogPostSlug(value: string): string {
  return value.trim().toLowerCase();
}

export function assertValidBlogPostId(id: string): void {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    throw new BlogRepositoryError("blog_post_not_found", "Article introuvable.");
  }
}

export function parseCreateAdminBlogPostInput(
  input: CreateAdminBlogPostInput
): CreateAdminBlogPostInput {
  const result = createAdminBlogPostInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "slug":
        throw new AdminBlogRepositoryError(
          "blog_post_slug_invalid",
          "Le slug de l'article est invalide."
        );
      case "title":
        throw new AdminBlogRepositoryError(
          "blog_post_title_invalid",
          "Le titre de l'article est invalide."
        );
      case "content":
        throw new AdminBlogRepositoryError(
          "blog_post_content_invalid",
          "Le contenu de l'article est invalide."
        );
      case "coverMediaId":
        throw new AdminBlogRepositoryError(
          "blog_post_cover_media_invalid",
          "Le média de couverture est invalide."
        );
      default:
        throw new AdminBlogRepositoryError(
          "blog_post_title_invalid",
          "Les données de l'article sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: CreateAdminBlogPostInput = {
    slug: data.slug,
    title: data.title,
    content: data.content,
  };

  if (data.excerpt !== undefined) parsed.excerpt = data.excerpt;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.coverMediaId !== undefined) parsed.coverMediaId = data.coverMediaId;
  if (data.publishedAt !== undefined) parsed.publishedAt = data.publishedAt;
  if (data.seoTitle !== undefined) parsed.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }

  return parsed;
}

export function parseUpdateAdminBlogPostInput(
  input: UpdateAdminBlogPostInput
): UpdateAdminBlogPostInput {
  const result = updateAdminBlogPostInputSchema.safeParse(input);

  if (!result.success) {
    const issue = result.error.issues[0];

    switch (issue?.path[0]) {
      case "id":
        throw new AdminBlogRepositoryError("blog_post_not_found", "Article introuvable.");
      case "slug":
        throw new AdminBlogRepositoryError(
          "blog_post_slug_invalid",
          "Le slug de l'article est invalide."
        );
      case "title":
        throw new AdminBlogRepositoryError(
          "blog_post_title_invalid",
          "Le titre de l'article est invalide."
        );
      case "content":
        throw new AdminBlogRepositoryError(
          "blog_post_content_invalid",
          "Le contenu de l'article est invalide."
        );
      case "coverMediaId":
        throw new AdminBlogRepositoryError(
          "blog_post_cover_media_invalid",
          "Le média de couverture est invalide."
        );
      default:
        throw new AdminBlogRepositoryError(
          "blog_post_title_invalid",
          "Les données de l'article sont invalides."
        );
    }
  }

  const data = result.data;
  const parsed: UpdateAdminBlogPostInput = {
    id: data.id,
    slug: data.slug,
    title: data.title,
    content: data.content,
  };

  if (data.excerpt !== undefined) parsed.excerpt = data.excerpt;
  if (data.status !== undefined) parsed.status = data.status;
  if (data.coverMediaId !== undefined) parsed.coverMediaId = data.coverMediaId;
  if (data.publishedAt !== undefined) parsed.publishedAt = data.publishedAt;
  if (data.seoTitle !== undefined) parsed.seoTitle = data.seoTitle;
  if (data.seoDescription !== undefined) {
    parsed.seoDescription = data.seoDescription;
  }

  return parsed;
}
