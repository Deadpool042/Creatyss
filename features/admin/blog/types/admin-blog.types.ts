export type AdminBlogPostStatus = "draft" | "published";

export type AdminBlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: AdminBlogPostStatus;
  publishedAt: string | null;
  hasContent: boolean;
};

export type AdminBlogPostDetail = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  primaryImagePath: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
  publishedAt: string | null;
};

export type CreateAdminBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  primaryImagePath: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
};

export type UpdateAdminBlogPostInput = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  primaryImagePath: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
};

export type AdminBlogServiceErrorCode = "slug_taken" | "blog_post_missing";

export class AdminBlogServiceError extends Error {
  readonly code: AdminBlogServiceErrorCode;

  constructor(code: AdminBlogServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AdminBlogServiceError";
    this.code = code;
  }
}
