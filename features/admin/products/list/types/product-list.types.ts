import type { GetAdminProductsFeedPageResult } from "./product-feed.types";

// ─── Admin product feed (re-exports + alias) ──────────────────────────────────

export type { AdminProductFeedItem } from "./product-feed.types";
export type { GetAdminProductsFeedPageCursor } from "./product-feed.types";
export type { GetAdminProductsFeedPageInput } from "./product-feed.types";
export type { GetAdminProductsFeedPageResult } from "./product-feed.types";

export type AdminProductFeedPageResult = GetAdminProductsFeedPageResult;

// ─── Admin product list item ──────────────────────────────────────────────────

export type AdminProductListCategory = {
  id: string;
  slug: string;
  name: string;
  parentName: string | null;
};

export type AdminProductListPriceSummary = {
  minAmount: string | null;
  maxAmount: string | null;
  minCompareAtAmount: string | null;
  hasPriceRange: boolean;
  hasPromotion: boolean;
};

export type AdminProductListItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: "draft" | "active" | "inactive" | "archived";
  isFeatured: boolean;
  productType: "simple" | "variable" | "typed";
  productTypeCode: string | null;
  variantCount: number;
  categoryCount: number;
  primaryCategory: AdminProductListCategory | null;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  amount: string | null;
  compareAtAmount: string | null;
  priceSummary: AdminProductListPriceSummary;
  updatedAt: string;
  stockQuantity: number;
  stockState: "in-stock" | "low-stock" | "out-of-stock";
  diagnostics: {
    missingPrimaryImage: boolean;
    missingPrice: boolean;
  };
};

// ─── Admin products list filters ──────────────────────────────────────────────

export type AdminProductsListStatusFilter =
  | "all"
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export type AdminProductsListFeaturedFilter = "all" | "featured" | "standard";

export type AdminProductsListFilters = {
  query: string;
  status: AdminProductsListStatusFilter;
  categoryId: string | null;
  parentCategoryId: string | null;
  featured: AdminProductsListFeaturedFilter;
  page: number;
};
