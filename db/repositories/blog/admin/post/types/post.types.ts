import type { BlogPostStatus } from "@db-blog/public/post";

export type AdminBlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: BlogPostStatus;
  coverMediaId: string | null;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminBlogPostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  status: BlogPostStatus;
  coverMediaId: string | null;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminBlogPostInput = {
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  status?: BlogPostStatus;
  coverMediaId?: string | null;
  publishedAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type UpdateAdminBlogPostInput = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  status?: BlogPostStatus;
  coverMediaId?: string | null;
  publishedAt?: Date | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type AdminBlogRepositoryErrorCode =
  | "blog_post_not_found"
  | "blog_post_slug_invalid"
  | "blog_post_title_invalid"
  | "blog_post_content_invalid"
  | "blog_post_cover_media_invalid"
  | "blog_post_slug_conflict";

export class AdminBlogRepositoryError extends Error {
  readonly code: AdminBlogRepositoryErrorCode;

  constructor(code: AdminBlogRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminBlogRepositoryError";
    this.code = code;
  }
}
