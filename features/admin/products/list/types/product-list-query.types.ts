import type {
  AdminProductCardItem,
  AdminProductStatus,
  ProductFeaturedFilter,
} from "./admin-product-card-item.types";
import type { GetAdminProductsFeedPageResult } from "./product-feed.types";

// ─── Admin product feed (re-exports + alias) ──────────────────────────────────

export type { AdminProductFeedItem } from "./product-feed.types";
export type { GetAdminProductsFeedPageCursor } from "./product-feed.types";
export type { GetAdminProductsFeedPageInput } from "./product-feed.types";
export type { GetAdminProductsFeedPageResult } from "./product-feed.types";

export type AdminProductFeedPageResult = GetAdminProductsFeedPageResult;

// ─── Admin product list item ──────────────────────────────────────────────────
export type ProductSortOption = "name-asc" | "name-desc" | "updated-asc" | "updated-desc";

export type ProductPickerItem = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type ProductListFilters = {
  search?: string;
  status?: AdminProductStatus[];
  featured?: ProductFeaturedFilter[];
  sort?: ProductSortOption;
  categorySlugs?: string[];
  page: number;
  perPage: number;
};

export type ProductStatusCounts = Partial<Record<AdminProductStatus, number>>;

export type ProductListResult = {
  items: AdminProductCardItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: ProductStatusCounts;
};
