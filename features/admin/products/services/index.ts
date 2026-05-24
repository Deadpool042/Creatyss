export {
  archiveProduct,
  restoreProduct,
  deleteProductPermanently,
  deleteProductCatalogByIdInTx,
  type ArchiveProductInput,
  type ArchiveProductResult,
  type RestoreProductInput,
  type RestoreProductResult,
} from "./product-lifecycle-services";

export {
  mapProductStatusToPrismaStatus,
  type ProductLifecycleStatus,
} from "./product-status-mappers";
