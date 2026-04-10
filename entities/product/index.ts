export {
  getProductPublishability,
  type ProductPublishabilityErrorCode,
} from "./product-publishability";

export {
  canChangeProductTypeToSimple,
  canCreateVariantForProductType,
  canDeleteVariantForProductType,
  isProductType,
  type ProductTypeCompatibilityErrorCode,
} from "./product-type-rules";

export {
  normalizeProductSlug,
  validateProductInput,
  type ProductInputErrorCode,
  type ProductInputValidationResult,
  type ProductStatus,
  type ProductType,
  type ValidatedProductInput,
} from "./product-input";

export {
  validateProductVariantInput,
  type ProductVariantInputErrorCode,
  type ProductVariantInputValidationResult,
  type ProductVariantStatus,
  type ValidatedProductVariantInput,
} from "./product-variant-input";

export {
  validateCreateProductImageInput,
  validateUpdateProductImageInput,
  type CreateProductImageValidationResult,
  type ProductImageInputErrorCode,
  type UpdateProductImageValidationResult,
  type ValidatedCreateProductImageInput,
  type ValidatedUpdateProductImageInput,
} from "./product-image-input";

export {
  normalizeProductSlug as normalizeAdminProductSlug,
  validateAdminProductInput,
  type AdminProductInputErrorCode,
  type AdminProductInputValidationResult,
  type ProductLifecycleStatus,
  type RelatedProductLinkType,
  type ValidatedAdminProductCategoryLinkInput,
  type ValidatedAdminProductInput,
  type ValidatedAdminRelatedProductInput,
} from "./admin-product-input";

export {
  validateAdminProductVariantInput,
  type AdminProductVariantInputErrorCode,
  type AdminProductVariantInputValidationResult,
  type ProductVariantLifecycleStatus,
  type ValidatedAdminProductVariantInput,
} from "./admin-product-variant-input";

export {
  validateAdminProductMediaReferenceInput,
  type AdminProductMediaReferenceInputErrorCode,
  type AdminProductMediaReferenceInputValidationResult,
  type ProductMediaReferenceRole,
  type ProductMediaReferenceSubjectType,
  type ValidatedAdminProductMediaReferenceInput,
} from "./admin-product-media-reference-input";
