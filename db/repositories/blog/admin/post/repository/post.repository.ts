import { Prisma } from "@prisma/client";
import { prisma } from "@db/prisma-client";
import {
  AdminBlogRepositoryError,
  type AdminBlogPostDetail,
  type AdminBlogPostSummary,
  type CreateAdminBlogPostInput,
  type UpdateAdminBlogPostInput,
} from "../types/post.types";
import { mapAdminBlogPostDetail, mapAdminBlogPostSummary } from "@db-blog/helpers/mappers";
import {
  normalizeBlogPostSlug,
  parseCreateAdminBlogPostInput,
  parseUpdateAdminBlogPostInput,
} from "@db-blog/helpers/validation";
import { createBlogPostInTx, updateBlogPostInTx } from "@db-blog/helpers/transactions";
import {
  findAdminBlogPostRowById,
  findAdminBlogPostRowBySlug,
  listAdminBlogPostRows,
} from "@db-blog/queries/admin";

function mapPrismaBlogError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminBlogRepositoryError(
      "blog_post_slug_conflict",
      "Un article avec ce slug existe déjà."
    );
  }

  if (error instanceof Error && error.message === "BLOG_POST_COVER_MEDIA_INVALID") {
    throw new AdminBlogRepositoryError(
      "blog_post_cover_media_invalid",
      "Le média de couverture est invalide."
    );
  }

  throw error;
}

export async function listAdminBlogPosts(): Promise<AdminBlogPostSummary[]> {
  const rows = await listAdminBlogPostRows();
  return rows.map(mapAdminBlogPostSummary);
}

export async function findAdminBlogPostById(id: string): Promise<AdminBlogPostDetail | null> {
  const row = await findAdminBlogPostRowById(id);

  if (!row) {
    return null;
  }

  return mapAdminBlogPostDetail(row);
}

export async function findAdminBlogPostBySlug(slug: string): Promise<AdminBlogPostDetail | null> {
  const normalizedSlug = normalizeBlogPostSlug(slug);
  const row = await findAdminBlogPostRowBySlug(normalizedSlug);

  if (!row) {
    return null;
  }

  return mapAdminBlogPostDetail(row);
}

export async function createAdminBlogPost(
  input: CreateAdminBlogPostInput
): Promise<AdminBlogPostDetail> {
  const parsedInput = parseCreateAdminBlogPostInput(input);
  const normalizedInput: CreateAdminBlogPostInput = {
    ...parsedInput,
    slug: normalizeBlogPostSlug(parsedInput.slug),
  };

  try {
    const blogPostId = await prisma.$transaction((tx) => createBlogPostInTx(tx, normalizedInput));

    const row = await findAdminBlogPostRowById(blogPostId);

    if (!row) {
      throw new AdminBlogRepositoryError("blog_post_not_found", "Article introuvable.");
    }

    return mapAdminBlogPostDetail(row);
  } catch (error) {
    mapPrismaBlogError(error);
  }
}

export async function updateAdminBlogPost(
  input: UpdateAdminBlogPostInput
): Promise<AdminBlogPostDetail | null> {
  const parsedInput = parseUpdateAdminBlogPostInput(input);
  const normalizedInput: UpdateAdminBlogPostInput = {
    ...parsedInput,
    slug: normalizeBlogPostSlug(parsedInput.slug),
  };

  try {
    const updated = await prisma.$transaction((tx) => updateBlogPostInTx(tx, normalizedInput));

    if (!updated) {
      return null;
    }

    const row = await findAdminBlogPostRowById(normalizedInput.id);

    if (!row) {
      return null;
    }

    return mapAdminBlogPostDetail(row);
  } catch (error) {
    mapPrismaBlogError(error);
  }
}

export async function deleteAdminBlogPost(id: string): Promise<boolean> {
  const deleted = await prisma.blogPost.deleteMany({
    where: { id },
  });

  return deleted.count > 0;
}
