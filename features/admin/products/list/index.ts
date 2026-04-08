export { useProductTableFilters } from "./hooks";
export type { ProductTableFiltersState } from "./hooks/use-product-table-filters";

export { productTableFiltersSchema } from "./schemas/product-table-filters.schema";
export type {
  ProductTableFeaturedFilter,
  ProductTableFiltersInput,
  ProductTableFiltersValues,
  ProductTableImageFilter,
  ProductTableSortOption,
  ProductTableStatusFilter,
  ProductTableStockFilter,
  ProductTableVariantFilter,
} from "./schemas/product-table-filters.schema";

export { buildAdminProductsCategoryFilter } from "./utils";
export {
  getFeaturedLabel,
  getImageLabel,
  getSortLabel,
  getStatusLabel,
  getStockLabel,
  getVariantLabel,
  parsePriceValue,
  stripHtml,
} from "./utils";

export { mapProductFilterCategoryOption, mapProductListItem } from "./mappers/client-safe";
export { mapAdminProductFeedItemToTableItem } from "./mappers/shared";

export type {
  AdminProductFeedItem,
  AdminProductFeedPageResult,
  AdminProductFeedQuery,
  AdminProductListCategory,
  AdminProductListItem,
  AdminProductListPriceSummary,
  AdminProductsListFeaturedFilter,
  AdminProductsListFilters,
  AdminProductsListStatusFilter,
  ProductFilterCategoryOption,
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductStockState,
  ProductTableItem,
  ToggleProductFeaturedResult,
} from "./types";

export { adminProductFeedQuerySchema } from "./types";
