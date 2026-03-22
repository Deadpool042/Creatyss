import type { BlogPostDetail, BlogPostSummary } from "../types/post.types";
import { mapBlogPostDetail, mapBlogPostSummary } from "@db-blog/helpers/mappers";
import { assertValidBlogPostId, normalizeBlogPostSlug } from "@db-blog/helpers/validation";
import {
  findBlogPostRowById,
  findBlogPostRowBySlug,
  listPublishedBlogPostRows,
} from "@db-blog/queries/public";

export async function findBlogPostById(id: string): Promise<BlogPostDetail | null> {
  assertValidBlogPostId(id);

  const row = await findBlogPostRowById(id);

  if (!row) {
    return null;
  }

  return mapBlogPostDetail(row);
}

export async function findBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const normalizedSlug = normalizeBlogPostSlug(slug);
  const row = await findBlogPostRowBySlug(normalizedSlug);

  if (!row) {
    return null;
  }

  return mapBlogPostDetail(row);
}

export async function listPublishedBlogPosts(): Promise<BlogPostSummary[]> {
  const rows = await listPublishedBlogPostRows();
  return rows.map(mapBlogPostSummary);
}
