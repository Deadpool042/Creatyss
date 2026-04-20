export type AdminCategorySummary = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  parentName: string | null;
  isFeatured: boolean;
  sortOrder: number;
  primaryImageUrl: string | null;
  updatedAt: string;
};

export type AdminCategoryDetail = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  parentName: string | null;
  isFeatured: boolean;
  sortOrder: number;
  primaryImageId: string | null;
  primaryImageUrl: string | null;
  updatedAt: string;
  seo: {
    metaTitle: string | null;
    metaDescription: string | null;
    canonicalPath: string | null;
    indexingMode: "INDEX_FOLLOW" | "INDEX_NOFOLLOW" | "NOINDEX_FOLLOW" | "NOINDEX_NOFOLLOW";
    sitemapIncluded: boolean;
    openGraphTitle: string | null;
    openGraphDescription: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
  };
};

export type AdminCategoryServiceErrorCode =
  | "category_missing"
  | "parent_category_missing"
  | "category_slug_taken"
  | "invalid_parent_assignment"
  | "media_asset_missing";

export class AdminCategoryServiceError extends Error {
  readonly code: AdminCategoryServiceErrorCode;

  constructor(code: AdminCategoryServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AdminCategoryServiceError";
    this.code = code;
  }
}
