export {
  archiveProduct,
  type ArchiveProductInput,
  type ArchiveProductResult,
} from "./services/archive-product.service";
export { archiveProductBySlugAction } from "./actions/archive-product.action";

export {
  restoreProduct,
  type RestoreProductInput,
  type RestoreProductResult,
} from "./services/restore-product.service";
export { restoreProductBySlugAction } from "./actions/restore-product.action";

export {
  deleteProductPermanently,
} from "./services/delete-product-permanently.service";
export { deleteProductPermanentlyBySlugAction } from "./actions/delete-product-permanently.action";
