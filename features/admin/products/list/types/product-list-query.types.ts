import type {
  AdminProductStatus,
  // ProductFeaturedFilter,
} from "./admin-product-card-item.types";
import type { AdminProductFeedItem } from "./product-feed.types";
// import type { ProductSortOption } from "./product-table.types";

export type ProductSortOption = "name-asc" | "name-desc" | "updated-asc" | "updated-desc";
export type ProductFeaturedFilter = "featured" | "standard";
export type AdminProductsListView = "active" | "trash";

// ─── Admin product list item ──────────────────────────────────────────────────

export type ProductPickerItem = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
};

export type ProductListFilters = {
  view?: AdminProductsListView;
  search?: string;
  status?: AdminProductStatus[];
  featured?: ProductFeaturedFilter[];
  sort?: ProductSortOption;
  categorySlugs?: string[];
  productSlugs?: string[];
  page?: number;
  perPage?: number;
};

export type ProductListUrlFilters = ProductListFilters;

export type ProductStatusCounts = {
  all: number;
  active: number;
  draft: number;
  inactive: number;
};

export type ProductListResult = {
  items: AdminProductFeedItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: ProductStatusCounts;
};
