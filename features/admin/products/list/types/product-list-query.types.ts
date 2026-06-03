import type {
  AdminProductStatus,
  // ProductFeaturedFilter,
} from "./admin-product-card-item.types";
import type { AdminProductFeedItem } from "./product-feed.types";
import type {
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductFeaturedFilterValue,
  ProductListView,
  ProductSortOption,
  ProductStatusCounts as ProductTableStatusCounts,
} from "./product-table.types";

export type ProductFeaturedFilter = ProductFeaturedFilterValue;
export type AdminProductsListView = ProductListView;
export type ProductStatusCounts = ProductTableStatusCounts;

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
  image?: ProductFilterImageOption;
  stock?: ProductFilterStockOption;
  variant?: ProductFilterVariantOption;
  sort?: ProductSortOption;
  categorySlugs?: string[];
  page?: number;
  perPage?: number;
};

export type ProductListUrlFilters = ProductListFilters;

export type ProductListResult = {
  items: AdminProductFeedItem[];
  total: number;
  totalPages: number;
  currentPage: number;
  statusCounts: ProductStatusCounts;
};
