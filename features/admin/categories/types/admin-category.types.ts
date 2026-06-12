//features/admin/categories/types/admin-category.types.ts
import type { CategoryLifecycleStatus } from "@/entities/category";
import type { SeoIndexingMode } from "@/entities/seo";

export type AdminCategorySortOption =
  | "name-asc"
  | "name-desc"
  | "status-asc"
  | "status-desc"
  | "is-featured-asc"
  | "is-featured-desc"
  | "products-asc"
  | "products-desc"
  | "created-at-asc"
  | "created-at-desc";

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
  status: CategoryLifecycleStatus;
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
    indexingMode: SeoIndexingMode;
    sitemapIncluded: boolean;
    openGraphTitle: string | null;
    openGraphDescription: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
  };
};

export type AdminCategoryServiceErrorCode =
  | "category_missing"
  | "store_missing"
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
