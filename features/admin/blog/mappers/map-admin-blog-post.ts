import { BlogPostStatus } from "@/prisma-generated/client";
import type {
  AdminBlogPostDetail,
  AdminBlogPostStatus,
  AdminBlogPostSummary,
} from "../types";

function toAdminBlogPostStatus(status: BlogPostStatus): AdminBlogPostStatus {
  return status === BlogPostStatus.ACTIVE ? "published" : "draft";
}

function toIsoString(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

type BlogPostSummaryRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  status: BlogPostStatus;
  publishedAt: Date | null;
};

type BlogPostDetailRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  status: BlogPostStatus;
  publishedAt: Date | null;
  primaryImage: {
    storageKey: string;
  } | null;
  coverImage: {
    storageKey: string;
  } | null;
};

export function mapAdminBlogPostSummary(post: BlogPostSummaryRecord): AdminBlogPostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    status: toAdminBlogPostStatus(post.status),
    publishedAt: toIsoString(post.publishedAt),
    hasContent: typeof post.body === "string" && post.body.trim().length > 0,
  };
}

export function mapAdminBlogPostDetail(post: BlogPostDetailRecord): AdminBlogPostDetail {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.body,
    seoTitle: null,
    seoDescription: null,
    primaryImagePath: post.primaryImage?.storageKey ?? null,
    coverImagePath: post.coverImage?.storageKey ?? null,
    status: toAdminBlogPostStatus(post.status),
    publishedAt: toIsoString(post.publishedAt),
  };
}

export function toPrismaBlogPostStatus(status: AdminBlogPostStatus): BlogPostStatus {
  return status === "published" ? BlogPostStatus.ACTIVE : BlogPostStatus.DRAFT;
}
