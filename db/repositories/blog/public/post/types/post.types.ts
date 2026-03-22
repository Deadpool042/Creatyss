export type BlogPostStatus = "draft" | "published" | "archived";

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverMediaId: string | null;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogPostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverMediaId: string | null;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BlogRepositoryErrorCode = "blog_post_not_found" | "blog_post_slug_invalid";

export class BlogRepositoryError extends Error {
  readonly code: BlogRepositoryErrorCode;

  constructor(code: BlogRepositoryErrorCode, message: string) {
    super(message);
    this.name = "BlogRepositoryError";
    this.code = code;
  }
}
