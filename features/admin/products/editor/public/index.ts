/**
 * Façade publique de l'éditeur produit admin.
 * Point d'entrée unique pour les composants UI qui consomment les actions
 * et les types de l'éditeur — aucun import direct vers les sous-modules
 * internes ne doit contourner ce barrel.
 */
export { deleteProductAction } from "../actions/delete-product.action";
export { deleteProductVariantAction } from "../actions/delete-product-variant.action";
export { setDefaultProductVariantAction } from "../actions/set-default-product-variant.action";
export { deleteProductImageAction } from "../actions/delete-product-image.action";
export { setProductPrimaryImageAction } from "../actions/set-product-primary-image.action";
export { reorderProductImageAction } from "../actions/reorder-product-image.action";
export { updateProductImageAltTextAction } from "../actions/update-product-image-alt-text.action";
export { attachProductImagesAction } from "../actions/attach-product-images.action";
export { uploadProductImagesAction } from "../actions/upload-product-images.action";

export type {
  AdminProductEditorData,
  AdminRelatedProductEditorType,
  AdminProductEditorProduct,
  AdminProductEditorCategoryLink,
  AdminProductEditorRelatedProduct,
  AdminProductEditorSeo,
  AdminProductEditorStatus,
} from "../types/product-editor.types";

export type { AdminProductImageItem, AdminProductImagesData } from "../types/product-images.types";

export { productVariantFormInitialState } from "../types/product-variants.types";

export type {
  AdminProductAvailabilityStatus,
  AdminPriceListOption,
  AdminProductOptionItem,
  AdminProductOptionValueItem,
  AdminProductVariantAvailability,
  AdminProductVariantEditorData,
  AdminProductVariantInventory,
  AdminProductVariantListItem,
  AdminProductVariantOptionValue,
  AdminProductVariantStatus,
  ProductVariantFormAction,
  ProductVariantFormState,
  ProductVariantFormValues,
  SetDefaultProductVariantInput,
  SetDefaultProductVariantResult,
  DeleteProductVariantInput,
  DeleteProductVariantResult,
} from "../types/product-variants.types";

export type {
  ProductCategoriesFormAction,
  ProductCategoriesFormState,
  ProductCategoriesFormValues,
} from "../types/product-categories-form.types";

export type {
  ProductGeneralFormAction,
  ProductGeneralFormState,
  ProductGeneralFormValues,
} from "../types/product-general-form.types";

export type {
  ProductAvailabilityFormAction,
  ProductAvailabilityFormState,
  ProductAvailabilityRowInput,
} from "../types/product-availability-form.types";
export { productAvailabilityFormInitialState } from "../types/product-availability-form.types";

export type {
  ProductInventoryFormAction,
  ProductInventoryFormState,
  ProductInventoryRowInput,
} from "../types/product-inventory-form.types";
export { productInventoryFormInitialState } from "../types/product-inventory-form.types";

export type {
  ProductRelatedProductsFormAction,
  ProductRelatedProductsFormState,
} from "../types/product-related-products-form.types";
export { productRelatedProductsFormInitialState } from "../types/product-related-products-form.types";

export type {
  ProductSeoFormAction,
  ProductSeoFormState,
  ProductSeoFormValues,
} from "../types/product-seo-form.types";

export type {
  DeleteProductImageInput,
  DeleteProductImageResult,
} from "../types/product-image-delete.types";

export type {
  UpdateProductImageAltTextInput,
  UpdateProductImageAltTextResult,
} from "../types/product-image-alt-text.types";

export type {
  SetProductPrimaryImageInput,
  SetProductPrimaryImageResult,
} from "../types/product-image-primary.types";

export type {
  ProductImageReorderDirection,
  ReorderProductImageInput,
  ReorderProductImageResult,
} from "../types/product-image-reorder.types";

export type {
  AttachProductImagesInput,
  AttachProductImagesResult,
} from "../types/product-image-attach.types";

export type {
  AttachableMediaAssetItem,
  AttachableMediaAssetsData,
} from "../types/product-image-library.types";

export type {
  UploadProductImagesFormState,
  UploadProductImagesInput,
} from "../types/product-image-upload-multi.types";

export type {
  AdminPriceEntry,
  AdminProductPriceEntry,
  AdminVariantPriceEntry,
  AdminProductPricingData,
  ProductPricingFormState,
  ProductPricingFormAction,
} from "../types/product-pricing-form.types";
export { productPricingFormInitialState } from "../types/product-pricing-form.types";
