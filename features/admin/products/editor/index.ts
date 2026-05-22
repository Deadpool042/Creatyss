import "server-only";

export { attachProductImagesAction } from "./actions/attach-product-images.action";
export { createProductVariantAction } from "./actions/create-product-variant.action";
export { deleteProductAction } from "./actions/delete-product.action";
export { deleteProductImageAction } from "./actions/delete-product-image.action";
export { deleteProductVariantAction } from "./actions/delete-product-variant.action";
export { reorderProductImageAction } from "./actions/reorder-product-image.action";
export { setDefaultProductVariantAction } from "./actions/set-default-product-variant.action";
export { setProductPrimaryImageAction } from "./actions/set-product-primary-image.action";
export { updateProductCategoriesAction } from "./actions/update-product-categories.action";
export { updateProductGeneralAction } from "./actions/update-product-general.action";
export { updateProductAvailabilityAction } from "./actions/update-product-availability.action";
export { updateProductInventoryAction } from "./actions/update-product-inventory.action";
export { updateProductImageAltTextAction } from "./actions/update-product-image-alt-text.action";
export { updateProductRelatedProductsAction } from "./actions/update-product-related-products.action";
export { updateProductCharacteristicsAction } from "./actions/update-product-characteristics.action";
export { updateProductSeoAction } from "./actions/update-product-seo.action";
export { updateProductPricesAction } from "./actions/update-product-prices.action";
export { updateProductVariantAction } from "./actions/update-product-variant.action";
export {
  createProductOptionColorValueAction,
  updateProductOptionColorValueAction,
  archiveProductOptionColorValueAction,
} from "./actions/update-product-option-color-hex.action";
export { uploadProductImagesAction } from "./actions/upload-product-images.action";

export {
  productImageAltTextSchema,
  productImageReorderSchema,
  productSeoFormSchema,
  productVariantFormSchema,
} from "./schemas";

export type {
  AdminProductEditorData,
  AdminRelatedProductEditorType,
  AdminProductEditorProduct,
  AdminProductEditorCategoryLink,
  AdminProductEditorRelatedProduct,
  AdminProductEditorSeo,
  AdminProductEditorStatus,
  CategoryNode,
  ProductCategoryOption,
  AdminProductImageItem,
  AdminProductImagesData,
  UploadProductImageFormState,
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
  ProductCategoriesFormAction,
  ProductCategoriesFormState,
  ProductCategoriesFormValues,
  ProductGeneralFormAction,
  ProductGeneralFormState,
  ProductGeneralFormValues,
  ProductAvailabilityFormAction,
  ProductAvailabilityFormState,
  ProductAvailabilityRowInput,
  ProductInventoryFormAction,
  ProductInventoryFormState,
  ProductInventoryRowInput,
  ProductRelatedProductsFormAction,
  ProductRelatedProductsFormState,
  ProductSeoFormAction,
  ProductSeoFormState,
  ProductSeoFormValues,
  DeleteProductImageInput,
  DeleteProductImageResult,
  UpdateProductImageAltTextInput,
  UpdateProductImageAltTextResult,
  SetProductPrimaryImageInput,
  SetProductPrimaryImageResult,
  ProductImageReorderDirection,
  ReorderProductImageInput,
  ReorderProductImageResult,
  AttachProductImagesInput,
  AttachProductImagesResult,
  AttachableMediaAssetItem,
  AttachableMediaAssetsData,
  UploadProductImagesFormState,
  UploadProductImagesInput,
  AdminPriceEntry,
  AdminVariantPriceEntry,
  AdminProductPricingData,
  ProductPricingFormState,
  ProductPricingFormAction,
  AdminProductCharacteristicItem,
  ProductCharacteristicsFormState,
  ProductCharacteristicsFormAction,
  AdminProductEditorCharacteristic,
} from "./types";

export {
  productVariantFormInitialState,
  productCategoriesFormInitialState,
  productGeneralFormInitialState,
  productAvailabilityFormInitialState,
  productInventoryFormInitialState,
  productRelatedProductsFormInitialState,
  uploadProductImagesFormInitialState,
  productPricingFormInitialState,
  productCharacteristicsFormInitialState,
} from "./types";

export {
  getAdminProductEditorData,
  listAdminProductTypeOptions,
  listAttachableMediaAssets,
  readAdminPriceLists,
  readAdminProductEditorBySlug,
  readAdminProductImages,
  readAdminProductVariants,
} from "./queries";
