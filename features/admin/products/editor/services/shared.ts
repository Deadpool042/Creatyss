import {
  AvailabilityStatus,
  MediaReferenceRole,
  MediaReferenceSubjectType,
  ProductStatus,
  ProductVariantStatus,
  RelatedProductType,
} from "@/prisma-generated/client";
import type { DbExecutor } from "@/core/db";

export class AdminProductEditorServiceError extends Error {
  readonly code:
    | "product_missing"
    | "variant_missing"
    | "image_missing"
    | "media_asset_missing"
    | "product_type_missing"
    | "category_missing"
    | "related_product_missing"
    | "variant_slug_taken"
    | "variant_sku_taken"
    | "default_variant_required"
    | "cannot_delete_default_variant"
    | "option_values_invalid"
    | "inventory_invalid";

  constructor(code: AdminProductEditorServiceError["code"], message?: string) {
    super(message ?? code);
    this.name = "AdminProductEditorServiceError";
    this.code = code;
  }
}

export function mapEditorStatusToPrismaStatus(
  status: "draft" | "active" | "inactive" | "archived"
): ProductStatus {
  switch (status) {
    case "draft":
      return ProductStatus.DRAFT;
    case "active":
      return ProductStatus.ACTIVE;
    case "inactive":
      return ProductStatus.INACTIVE;
    case "archived":
      return ProductStatus.ARCHIVED;
  }
}

export function mapEditorVariantStatusToPrismaStatus(
  status: "draft" | "active" | "inactive" | "archived"
): ProductVariantStatus {
  switch (status) {
    case "draft":
      return ProductVariantStatus.DRAFT;
    case "active":
      return ProductVariantStatus.ACTIVE;
    case "inactive":
      return ProductVariantStatus.INACTIVE;
    case "archived":
      return ProductVariantStatus.ARCHIVED;
  }
}

export function mapEditorAvailabilityStatusToPrismaStatus(
  status: "available" | "unavailable" | "preorder" | "backorder" | "discontinued" | "archived"
): AvailabilityStatus {
  switch (status) {
    case "available":
      return AvailabilityStatus.AVAILABLE;
    case "preorder":
      return AvailabilityStatus.PREORDER;
    case "backorder":
      return AvailabilityStatus.BACKORDER;
    case "discontinued":
      return AvailabilityStatus.DISCONTINUED;
    case "archived":
      return AvailabilityStatus.ARCHIVED;
    default:
      return AvailabilityStatus.UNAVAILABLE;
  }
}

export function mapEditorRelatedTypeToPrismaType(
  type: "related" | "cross_sell" | "up_sell" | "accessory" | "similar"
): RelatedProductType {
  switch (type) {
    case "related":
      return RelatedProductType.RELATED;
    case "cross_sell":
      return RelatedProductType.CROSS_SELL;
    case "up_sell":
      return RelatedProductType.UP_SELL;
    case "accessory":
      return RelatedProductType.ACCESSORY;
    case "similar":
      return RelatedProductType.SIMILAR;
  }
}

export function mapEditorSubjectTypeToPrismaSubjectType(
  subjectType: "product" | "product_variant"
): MediaReferenceSubjectType {
  switch (subjectType) {
    case "product":
      return MediaReferenceSubjectType.PRODUCT;
    case "product_variant":
      return MediaReferenceSubjectType.PRODUCT_VARIANT;
  }
}

export function mapEditorRoleToPrismaRole(
  role: "gallery" | "thumbnail" | "other"
): MediaReferenceRole {
  switch (role) {
    case "gallery":
      return MediaReferenceRole.GALLERY;
    case "thumbnail":
      return MediaReferenceRole.THUMBNAIL;
    case "other":
      return MediaReferenceRole.OTHER;
  }
}

export async function assertProductExists(
  executor: DbExecutor,
  productId: string
): Promise<{
  id: string;
  storeId: string;
  primaryImageId: string | null;
}> {
  const product = await executor.product.findFirst({
    where: {
      id: productId,
      archivedAt: null,
    },
    select: {
      id: true,
      storeId: true,
      primaryImageId: true,
    },
  });

  if (product === null) {
    throw new AdminProductEditorServiceError("product_missing");
  }

  return product;
}

export async function assertVariantExists(
  executor: DbExecutor,
  productId: string,
  variantId: string
): Promise<{
  id: string;
  productId: string;
  isDefault: boolean;
}> {
  const variant = await executor.productVariant.findFirst({
    where: {
      id: variantId,
      productId,
      archivedAt: null,
    },
    select: {
      id: true,
      productId: true,
      isDefault: true,
    },
  });

  if (variant === null) {
    throw new AdminProductEditorServiceError("variant_missing");
  }

  return variant;
}

export async function assertMediaAssetExists(
  executor: DbExecutor,
  assetId: string
): Promise<void> {
  const asset = await executor.mediaAsset.findFirst({
    where: {
      id: assetId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (asset === null) {
    throw new AdminProductEditorServiceError("media_asset_missing");
  }
}

export async function assertProductTypeExists(
  executor: DbExecutor,
  productTypeId: string
): Promise<void> {
  const productType = await executor.productType.findFirst({
    where: {
      id: productTypeId,
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (productType === null) {
    throw new AdminProductEditorServiceError("product_type_missing");
  }
}

export async function assertCategoriesExist(
  executor: DbExecutor,
  categoryIds: readonly string[]
): Promise<void> {
  if (categoryIds.length === 0) {
    return;
  }

  const categories = await executor.category.findMany({
    where: {
      id: {
        in: [...categoryIds],
      },
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (categories.length !== categoryIds.length) {
    throw new AdminProductEditorServiceError("category_missing");
  }
}

export async function assertVariantOptionValuesAreValid(
  executor: DbExecutor,
  productId: string,
  optionValueIds: readonly string[]
): Promise<void> {
  if (optionValueIds.length === 0) return;

  const product = await executor.product.findFirst({
    where: { id: productId, archivedAt: null },
    select: { productTypeId: true },
  });

  if (product === null) {
    throw new AdminProductEditorServiceError("product_missing");
  }

  // No productTypeId → no valid option axis exists for this product
  if (product.productTypeId === null) {
    throw new AdminProductEditorServiceError("option_values_invalid");
  }

  const values = await executor.productOptionValue.findMany({
    where: {
      id: { in: [...optionValueIds] },
      isActive: true,
      archivedAt: null,
    },
    select: {
      id: true,
      option: {
        select: {
          isVariantAxis: true,
          isActive: true,
          archivedAt: true,
          productTypeId: true,
        },
      },
    },
  });

  if (values.length !== optionValueIds.length) {
    throw new AdminProductEditorServiceError("option_values_invalid");
  }

  for (const v of values) {
    if (
      !v.option.isVariantAxis ||
      !v.option.isActive ||
      v.option.archivedAt !== null ||
      v.option.productTypeId !== product.productTypeId
    ) {
      throw new AdminProductEditorServiceError("option_values_invalid");
    }
  }
}

export async function assertRelatedProductsExist(
  executor: DbExecutor,
  productId: string,
  relatedProductIds: readonly string[]
): Promise<void> {
  if (relatedProductIds.length === 0) {
    return;
  }

  if (relatedProductIds.includes(productId)) {
    throw new AdminProductEditorServiceError("related_product_missing");
  }

  const products = await executor.product.findMany({
    where: {
      id: {
        in: [...relatedProductIds],
      },
      archivedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (products.length !== relatedProductIds.length) {
    throw new AdminProductEditorServiceError("related_product_missing");
  }
}
