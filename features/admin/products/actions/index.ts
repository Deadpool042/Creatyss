import "server-only";

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
  archiveProductBySlugAction,
  deleteProductPermanentlyBySlugAction,
  restoreProductBySlugAction,
} from "./product-lifecycle-actions";
