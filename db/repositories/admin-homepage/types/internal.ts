export type AdminHomepageRepositoryErrorCode =
  | "homepage_missing"
  | "product_missing"
  | "category_missing"
  | "blog_post_missing";

export class AdminHomepageRepositoryError extends Error {
  readonly code: AdminHomepageRepositoryErrorCode;

  constructor(code: AdminHomepageRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
