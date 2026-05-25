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
  listAdminProducts,
  listProductFilterCategories,
} from "./queries";

export { mapAdminProductFeedItem, mapProductTableItem } from "./mappers";

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
