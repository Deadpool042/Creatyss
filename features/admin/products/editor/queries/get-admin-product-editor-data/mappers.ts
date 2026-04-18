import {
  mapAdminProductStatus,
  mapAdminProductVariantStatus,
} from "@/features/admin/products/mappers";

import type {
  AdminProductEditorData,
  AdminProductImageItem,
  AdminProductVariantListItem,
} from "@/features/admin/products/editor/types";

import type {
  ProductEditorCoreRecord,
  ProductEditorMediaReferenceRecord,
  ProductEditorSeoMetadataRecord,
} from "./types";

function mapAvailabilityStatus(
  status: string
): AdminProductVariantListItem["availability"]["status"] {
  switch (status) {
    case "AVAILABLE":
      return "available";
    case "PREORDER":
      return "preorder";
    case "BACKORDER":
      return "backorder";
    case "DISCONTINUED":
      return "discontinued";
    case "ARCHIVED":
      return "archived";
    default:
      return "unavailable";
  }
}

function mapMediaRole(role: string): AdminProductImageItem["role"] {
  switch (role) {
    case "PRIMARY":
      return "primary";
    case "COVER":
      return "cover";
    case "THUMBNAIL":
      return "thumbnail";
    case "OTHER":
      return "other";
    default:
      return "gallery";
  }
}

function mapAdminProductVariants(
  variants: ProductEditorCoreRecord["variants"]
): AdminProductVariantListItem[] {
  return variants.map((variant) => {
    const availabilityRecord = variant.availabilityRecords[0] ?? null;
    const inventoryItem = variant.inventoryItems[0] ?? null;
    const onHandQuantity = inventoryItem?.onHandQuantity ?? 0;
    const reservedQuantity = inventoryItem?.reservedQuantity ?? 0;

    return {
      id: variant.id,
      slug: variant.slug,
      sku: variant.sku,
      name: variant.name,
      status: mapAdminProductVariantStatus(variant.status),
      isDefault: variant.isDefault,
      sortOrder: variant.sortOrder,
      barcode: variant.barcode,
      externalReference: variant.externalReference,
      weightGrams: variant.weightGrams?.toString() ?? null,
      widthMm: variant.widthMm?.toString() ?? null,
      heightMm: variant.heightMm?.toString() ?? null,
      depthMm: variant.depthMm?.toString() ?? null,
      primaryImageId: variant.primaryImageId,
      primaryImageUrl: variant.primaryImage?.publicUrl ?? null,
      primaryImageStorageKey: variant.primaryImage?.storageKey ?? null,
      primaryImageAltText: variant.primaryImage?.altText ?? null,
      availability: {
        status: mapAvailabilityStatus(availabilityRecord?.status ?? "UNAVAILABLE"),
        isSellable: availabilityRecord?.isSellable ?? false,
        backorderAllowed: availabilityRecord?.backorderAllowed ?? false,
        sellableFrom: availabilityRecord?.sellableFrom?.toISOString() ?? null,
        sellableUntil: availabilityRecord?.sellableUntil?.toISOString() ?? null,
        preorderStartsAt: availabilityRecord?.preorderStartsAt?.toISOString() ?? null,
        preorderEndsAt: availabilityRecord?.preorderEndsAt?.toISOString() ?? null,
      },
      inventory: {
        onHandQuantity,
        reservedQuantity,
        availableQuantity: onHandQuantity - reservedQuantity,
        hasInventoryRecord: inventoryItem !== null,
      },
      optionValues: [...variant.optionValues]
        .sort((left, right) => {
          const optionOrder =
            left.optionValue.option.sortOrder - right.optionValue.option.sortOrder;

          if (optionOrder !== 0) {
            return optionOrder;
          }

          const valueOrder = left.optionValue.sortOrder - right.optionValue.sortOrder;

          if (valueOrder !== 0) {
            return valueOrder;
          }

          return left.optionValue.option.name.localeCompare(right.optionValue.option.name, "fr");
        })
        .map((item) => ({
          optionName: item.optionValue.option.name,
          value: item.optionValue.label ?? item.optionValue.value,
          optionValueId: item.optionValue.id,
          optionId: item.optionValue.option.id,
        })),
    };
  });
}

function mapAdminProductImages(
  mediaReferences: ProductEditorMediaReferenceRecord[]
): AdminProductImageItem[] {
  return mediaReferences.map((reference) => ({
    id: reference.id,
    mediaAssetId: reference.assetId,
    subjectType: reference.subjectType === "PRODUCT_VARIANT" ? "product_variant" : "product",
    subjectId: reference.subjectId,
    role: mapMediaRole(reference.role),
    sortOrder: reference.sortOrder,
    isPrimary: reference.isPrimary,
    publicUrl: reference.asset.publicUrl,
    storageKey: reference.asset.storageKey,
    altText: reference.asset.altText,
    originalName: reference.asset.originalFilename,
    mimeType: reference.asset.mimeType,
  }));
}

function mapRelatedProductType(
  type: string
): AdminProductEditorData["product"]["relatedProducts"][number]["type"] {
  if (type === "CROSS_SELL") return "cross_sell";
  if (type === "UP_SELL") return "up_sell";
  if (type === "ACCESSORY") return "accessory";
  if (type === "SIMILAR") return "similar";
  return "related";
}

export function mapProductEditorData(input: {
  product: ProductEditorCoreRecord;
  mediaReferences: ProductEditorMediaReferenceRecord[];
  seoMetadata: ProductEditorSeoMetadataRecord;
}): AdminProductEditorData {
  const variants = mapAdminProductVariants(input.product.variants);
  const images = mapAdminProductImages(input.mediaReferences);

  const fallbackTitle = input.product.name;
  const fallbackDescription = input.product.shortDescription ?? "";
  const fallbackCanonicalPath = `/boutique/${input.product.slug}`;
  const fallbackOpenGraphTitle =
    input.seoMetadata?.metaTitle && input.seoMetadata.metaTitle.trim().length > 0
      ? input.seoMetadata.metaTitle
      : fallbackTitle;
  const fallbackOpenGraphDescription =
    input.seoMetadata?.metaDescription && input.seoMetadata.metaDescription.trim().length > 0
      ? input.seoMetadata.metaDescription
      : fallbackDescription;

  return {
    product: {
      id: input.product.id,
      storeId: input.product.storeId,
      slug: input.product.slug,
      name: input.product.name,
      skuRoot: input.product.skuRoot,
      shortDescription: input.product.shortDescription,
      description: input.product.description,
      status: mapAdminProductStatus(input.product.status),
      isFeatured: input.product.isFeatured,
      archivedAt: input.product.archivedAt,
      isArchived: input.product.archivedAt !== null,
      isStandalone: input.product.isStandalone,
      productTypeId: input.product.productTypeId,
      productTypeCode: input.product.productType?.code ?? null,
      primaryImageId: input.product.primaryImageId,
      primaryImageUrl: input.product.primaryImage?.publicUrl ?? null,
      primaryImageStorageKey: input.product.primaryImage?.storageKey ?? null,
      primaryImageAltText: input.product.primaryImage?.altText ?? null,
      categoryLinks: input.product.productCategories.map((link) => ({
        id: link.id,
        categoryId: link.categoryId,
        categoryName: link.category.name,
        categorySlug: link.category.slug,
        isPrimary: link.isPrimary,
        sortOrder: link.sortOrder,
      })),
      relatedProducts: input.product.relatedFrom.map((link) => ({
        id: link.id,
        targetProductId: link.targetProductId,
        targetProductName: link.targetProduct.name,
        targetProductSlug: link.targetProduct.slug,
        type: mapRelatedProductType(link.type),
        sortOrder: link.sortOrder,
      })),
    },
    variants,
    images,
    seo: {
      title: input.seoMetadata?.metaTitle ?? "",
      description: input.seoMetadata?.metaDescription ?? "",
      canonicalPath: input.seoMetadata?.canonicalPath ?? null,
      indexingMode: input.seoMetadata?.indexingMode ?? "INDEX_FOLLOW",
      sitemapIncluded: input.seoMetadata?.sitemapIncluded ?? true,
      openGraphTitle: input.seoMetadata?.openGraphTitle ?? "",
      openGraphDescription: input.seoMetadata?.openGraphDescription ?? "",
      openGraphImageId: input.seoMetadata?.openGraphImageId ?? null,
      twitterTitle: input.seoMetadata?.twitterTitle ?? "",
      twitterDescription: input.seoMetadata?.twitterDescription ?? "",
      twitterImageId: input.seoMetadata?.twitterImageId ?? null,
      fallbackTitle,
      fallbackDescription,
      fallbackCanonicalPath,
      fallbackOpenGraphTitle,
      fallbackOpenGraphDescription,
    },
  };
}
