import type { AdminBlogPostDetail, AdminBlogPostSummary } from "@db-blog/admin/post";
import type { BlogPostDetail, BlogPostSummary } from "@db-blog/public/post";
import type { AdminBlogPostRow, BlogPostDetailRow, BlogPostSummaryRow } from "@db-blog/types/rows";

export function mapBlogPostSummary(row: BlogPostSummaryRow): BlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverMediaId: row.coverMediaId,
    publishedAt: row.publishedAt,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapBlogPostDetail(row: BlogPostDetailRow): BlogPostDetail {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverMediaId: row.coverMediaId,
    publishedAt: row.publishedAt,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminBlogPostSummary(row: AdminBlogPostRow): AdminBlogPostSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    status: row.status,
    coverMediaId: row.coverMediaId,
    publishedAt: row.publishedAt,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminBlogPostDetail(row: AdminBlogPostRow): AdminBlogPostDetail {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    status: row.status,
    coverMediaId: row.coverMediaId,
    publishedAt: row.publishedAt,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
