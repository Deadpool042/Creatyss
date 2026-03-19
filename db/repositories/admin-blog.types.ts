export type AdminBlogPostStatus = "draft" | "published";

export type CreateAdminBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
};

export type UpdateAdminBlogPostInput = CreateAdminBlogPostInput & {
  id: string;
};

export type AdminBlogPostSummary = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImagePath: string | null;
  status: AdminBlogPostStatus;
  publishedAt: string | null;
  hasContent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminBlogPostDetail = AdminBlogPostSummary & {
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type AdminBlogRepositoryErrorCode = "slug_taken" | "blog_post_referenced";

export class AdminBlogRepositoryError extends Error {
  readonly code: AdminBlogRepositoryErrorCode;

  constructor(code: AdminBlogRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
