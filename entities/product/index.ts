export {
  normalizeProductSlug,
  validateProductInput,
  PRODUCT_TYPE_VALUES,
  type ProductInputErrorCode,
  type ProductInputValidationResult,
  type ProductStatus,
  type ProductType,
  type ValidatedProductInput,
} from "./product-input";

export {
  PRODUCT_AVAILABILITY_STATUS_VALUES,
  type ProductAvailabilityStatus,
} from "./product-availability-status";

export {
  PRODUCT_RELATED_TYPE_VALUES,
  type ProductRelatedType,
} from "./product-related-type";

export {
  PRODUCT_LIFECYCLE_STATUS_VALUES,
  type ProductLifecycleStatus,
} from "./product-lifecycle-status";

export {
  mapPrismaProductStatusToLifecycleStatus,
  mapProductLifecycleStatusToPrismaStatus,
  mapPrismaProductVariantStatusToLifecycleStatus,
  mapProductVariantLifecycleStatusToPrismaStatus,
} from "./product-status-prisma";

export {
  mapPrismaRelatedTypeToProductRelatedType,
  mapProductRelatedTypeToPrismaRelatedType,
} from "./product-related-type-prisma";

export {
  validateProductVariantInput,
  type ProductVariantInputErrorCode,
  type ProductVariantInputValidationResult,
  type ProductVariantStatus,
  type ValidatedProductVariantInput,
} from "./product-variant-input";

export {
  PRODUCT_VARIANT_LIFECYCLE_STATUS_VALUES,
  type ProductVariantLifecycleStatus,
} from "./product-variant-lifecycle-status";

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
  validateAdminProductCategoryLinks,
  validateAdminProductRelatedProducts,
  validateAdminProductCharacteristics,
  type AdminProductCategoryLinksValidationResult,
  type AdminProductRelatedProductsValidationResult,
  type AdminProductCharacteristicsValidationResult,
  type AdminProductCharacteristicInputErrorCode,
  type AdminProductCharacteristicIssueCode,
  type AdminProductCharacteristicValidationIssue,
  type AdminProductInputErrorCode,
  type AdminProductInputValidationResult,
  type RelatedProductLinkType,
  type ValidatedAdminProductCharacteristicInput,
  type ValidatedAdminProductCategoryLinkInput,
  type ValidatedAdminProductInput,
  type ValidatedAdminRelatedProductInput,
} from "./admin-product-input";

export {
  validateAdminProductVariantInput,
  type AdminProductVariantInputErrorCode,
  type AdminProductVariantInputValidationResult,
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

export {
  getProductStructurePresentation,
  type ProductStructurePresentation,
} from "./product-public-presentation";
