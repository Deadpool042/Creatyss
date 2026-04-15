export { useProductTableFilters } from "./hooks/use-product-table-filters";

export { toggleProductFeaturedAction } from "./actions/toggle-product-featured.action";
export { bulkUpdateProductStatusAction } from "./actions/bulk-update-product-status.action";
export { bulkUpdateProductFeaturedAction } from "./actions/bulk-update-product-featured.action";
export { archiveProductAction } from "./actions/archive-product.action";
export { restoreProductAction } from "./actions/restore-product.action";
export { bulkRestoreProductsAction } from "./actions/bulk-restore-products.action";
export { bulkArchiveProductsAction } from "./actions/bulk-archive-products.action";
export { deleteProductPermanentlyAction } from "./actions/delete-product-permanently.action";
export { bulkDeleteProductsPermanentlyAction } from "./actions/bulk-delete-products-permanently.action";

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

export { getAdminProductsFeedPage } from "./queries/get-admin-products-feed-page.query";
export { getAdminProductsFeedPage as getAdminProductsFeed } from "./queries/get-admin-products-feed-page.query";
export { listAdminProducts } from "./queries/list-admin-products.query";
export { listProductFilterCategories } from "./queries/list-product-filter-categories.query";

export { mapProductFilterCategoryOption } from "./mappers/map-product-filter-category-option";
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
export { bulkUpdateProductStatusSchema } from "./schemas/bulk-update-product-status.schema";
export { bulkUpdateProductFeaturedSchema } from "./schemas/bulk-update-product-featured.schema";
export { bulkArchiveProductsSchema } from "./schemas/bulk-archive-products.schema";
export { bulkRestoreProductsSchema } from "./schemas/bulk-restore-products.schema";
export { deleteProductPermanentlySchema } from "./schemas/delete-product-permanently.schema";
export { bulkDeleteProductsPermanentlySchema } from "./schemas/bulk-delete-products-permanently.schema";

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
  ProductTableFiltersState,
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
  ArchiveProductInput,
  ArchiveProductResult,
  RestoreProductInput,
  RestoreProductResult,
  BulkRestoreProductsInput,
  BulkRestoreProductsResult,
  BulkArchiveProductsInput,
  BulkArchiveProductsResult,
  DeleteProductPermanentlyInput,
  DeleteProductPermanentlyResult,
  BulkDeleteProductsPermanentlyInput,
  BulkDeleteProductsPermanentlyResult,
} from "./types";
