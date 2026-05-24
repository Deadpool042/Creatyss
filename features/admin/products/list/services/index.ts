export { toggleProductFeatured } from "./toggle-product-featured.service";
export {
  archiveProduct,
  restoreProduct,
  deleteProductPermanently,
} from "../../actions/product-lifecycle-services";

export {
  bulkArchiveProducts,
  bulkRestoreProducts,
  bulkDeleteProductsPermanently,
  bulkUpdateProductFeatured,
  bulkUpdateProductStatus,
} from "./product-bulk-services";
