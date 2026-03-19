type AdminBlogPostStatus = "draft" | "published";

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

type BlogRepositoryErrorCode = "slug_taken" | "blog_post_referenced";

export class AdminBlogRepositoryError extends Error {
  readonly code: BlogRepositoryErrorCode;

  constructor(code: BlogRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
