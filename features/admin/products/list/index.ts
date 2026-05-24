import "server-only";

export {
  toggleProductFeaturedAction,
  bulkUpdateProductStatusAction,
  bulkUpdateProductFeaturedAction,
  bulkRestoreProductsAction,
  bulkArchiveProductsAction,
  bulkDeleteProductsPermanentlyAction,
} from "./actions";

export {
  toggleProductFeatured,
  bulkUpdateProductStatus,
  bulkUpdateProductFeatured,
  archiveProduct,
  restoreProduct,
  bulkRestoreProducts,
  bulkArchiveProducts,
  deleteProductPermanently,
  bulkDeleteProductsPermanently,
} from "./services";

export {
  getAdminProductsFeedPage,
  getAdminProductsFeedPage as getAdminProductsFeed,
  listAdminProducts,
  listProductFilterCategories,
} from "./queries";

export { mapAdminProductFeedItemToTableItem } from "./mappers/shared/map-admin-product-feed-item-to-table-item";
export { mapProductTableItem } from "./mappers/server/map-product-table-item";

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

export { productTableFiltersSchema } from "./schemas/product-table-filters.schema";
export { adminProductFeedQuerySchema } from "./schemas/admin-product-feed-query.schema";
export {
  bulkUpdateProductStatusSchema,
  bulkUpdateProductFeaturedSchema,
  bulkArchiveProductsSchema,
  bulkRestoreProductsSchema,
  deleteProductPermanentlySchema,
  bulkDeleteProductsPermanentlySchema,
} from "./schemas/product-bulk-schemas";

export type {
  AdminProductFeedItem,
  GetAdminProductsFeedPageCursor,
  GetAdminProductsFeedPageInput,
  GetAdminProductsFeedPageResult,
  ProductFilterCategoryOption,
  ProductFilterFeaturedOption,
  ProductFilterImageOption,
  ProductFilterStockOption,
  ProductFilterVariantOption,
  ProductSortOption,
  ProductStockState,
  ProductTableActiveFilter,
  ProductTableFeaturedFilter,
  ProductTableFiltersInput,
  ProductTableFiltersValues,
  ProductTableImageFilter,
  ProductTableItem,
  ProductTableSortOption,
  ProductTableStatus,
  ProductTableStatusFilter,
  ProductTableStockFilter,
  ProductTableVariantFilter,
  ToggleProductFeaturedInput,
  ToggleProductFeaturedResult,
  BulkUpdateProductStatusInput,
  BulkUpdateProductStatusResult,
  BulkUpdateProductFeaturedInput,
  BulkUpdateProductFeaturedResult,
  BulkRestoreProductsInput,
  BulkRestoreProductsResult,
  BulkArchiveProductsInput,
  BulkArchiveProductsResult,
  BulkDeleteProductsPermanentlyInput,
  BulkDeleteProductsPermanentlyResult,
} from "./types";
