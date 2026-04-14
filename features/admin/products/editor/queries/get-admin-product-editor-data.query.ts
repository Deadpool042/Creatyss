import { db } from "@/core/db";
import type {
  AdminProductEditorData,
  AdminProductImageItem,
  AdminProductVariantListItem,
} from "@/features/admin/products/editor/types";

type GetAdminProductEditorDataInput = {
  productId: string;
};

function mapProductStatus(status: string): AdminProductEditorData["product"]["status"] {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "INACTIVE":
      return "inactive";
    case "ARCHIVED":
      return "archived";
    default:
      return "draft";
  }
}

function mapVariantStatus(status: string): AdminProductVariantListItem["status"] {
  switch (status) {
    case "ACTIVE":
      return "active";
    case "INACTIVE":
      return "inactive";
    case "ARCHIVED":
      return "archived";
    default:
      return "draft";
  }
}

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

export async function getAdminProductEditorData(
  input: GetAdminProductEditorDataInput
): Promise<AdminProductEditorData | null> {
  const product = await db.product.findFirst({
    where: {
      id: input.productId,
      archivedAt: null,
    },
    select: {
      id: true,
      storeId: true,
      slug: true,
      name: true,
      skuRoot: true,
      shortDescription: true,
      description: true,
      status: true,
      isFeatured: true,
      isStandalone: true,
      productTypeId: true,
      productType: {
        select: {
          code: true,
        },
      },
      primaryImageId: true,
      primaryImage: {
        select: {
          publicUrl: true,
          storageKey: true,
          altText: true,
        },
      },
      productCategories: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          categoryId: true,
          isPrimary: true,
          sortOrder: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      relatedFrom: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          targetProductId: true,
          type: true,
          sortOrder: true,
          targetProduct: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
      variants: {
        where: {
          archivedAt: null,
        },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          slug: true,
          sku: true,
          name: true,
          status: true,
          isDefault: true,
          sortOrder: true,
          barcode: true,
          externalReference: true,
          weightGrams: true,
          widthMm: true,
          heightMm: true,
          depthMm: true,
          primaryImageId: true,
          primaryImage: {
            select: {
              publicUrl: true,
              storageKey: true,
              altText: true,
            },
          },
          optionValues: {
            select: {
              optionValue: {
                select: {
                  id: true,
                  value: true,
                  label: true,
                  sortOrder: true,
                  option: {
                    select: {
                      id: true,
                      name: true,
                      sortOrder: true,
                    },
                  },
                },
              },
            },
          },
          availabilityRecords: {
            where: {
              archivedAt: null,
            },
            orderBy: [{ updatedAt: "desc" }],
            take: 1,
            select: {
              status: true,
              isSellable: true,
              backorderAllowed: true,
              sellableFrom: true,
              sellableUntil: true,
              preorderStartsAt: true,
              preorderEndsAt: true,
            },
          },
          inventoryItems: {
            where: {
              archivedAt: null,
              status: "ACTIVE",
            },
            orderBy: [{ updatedAt: "desc" }],
            take: 1,
            select: {
              onHandQuantity: true,
              reservedQuantity: true,
            },
          },
        },
      },
    },
  });

  if (product === null) {
    return null;
  }

  const [mediaReferences, seoMetadata] = await Promise.all([
    db.mediaReference.findMany({
      where: {
        archivedAt: null,
        OR: [
          {
            subjectType: "PRODUCT",
            subjectId: product.id,
          },
          {
            subjectType: "PRODUCT_VARIANT",
            subjectId: {
              in: product.variants.map((variant) => variant.id),
            },
          },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      select: {
        id: true,
        assetId: true,
        subjectType: true,
        subjectId: true,
        role: true,
        sortOrder: true,
        isPrimary: true,
        asset: {
          select: {
            publicUrl: true,
            storageKey: true,
            altText: true,
            originalFilename: true,
            mimeType: true,
          },
        },
      },
    }),
    db.seoMetadata.findFirst({
      where: {
        storeId: product.storeId,
        subjectType: "PRODUCT",
        subjectId: product.id,
        archivedAt: null,
      },
      select: {
        metaTitle: true,
        metaDescription: true,
        canonicalPath: true,
        indexingMode: true,
        sitemapIncluded: true,
        openGraphTitle: true,
        openGraphDescription: true,
        openGraphImageId: true,
        twitterTitle: true,
        twitterDescription: true,
        twitterImageId: true,
      },
    }),
  ]);

  const variants: AdminProductVariantListItem[] = product.variants.map((variant) => {
    const availabilityRecord = variant.availabilityRecords[0] ?? null;
    const inventoryItem = variant.inventoryItems[0] ?? null;
    const onHandQuantity = inventoryItem?.onHandQuantity ?? 0;
    const reservedQuantity = inventoryItem?.reservedQuantity ?? 0;

    return {
      id: variant.id,
      slug: variant.slug,
      sku: variant.sku,
      name: variant.name,
      status: mapVariantStatus(variant.status),
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
          const optionOrder = left.optionValue.option.sortOrder - right.optionValue.option.sortOrder;

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

  const images: AdminProductImageItem[] = mediaReferences.map((reference) => ({
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

  const fallbackTitle = product.name;
  const fallbackDescription = product.shortDescription ?? "";
  const fallbackCanonicalPath = `/boutique/${product.slug}`;
  const fallbackOpenGraphTitle =
    seoMetadata?.metaTitle && seoMetadata.metaTitle.trim().length > 0
      ? seoMetadata.metaTitle
      : fallbackTitle;
  const fallbackOpenGraphDescription =
    seoMetadata?.metaDescription && seoMetadata.metaDescription.trim().length > 0
      ? seoMetadata.metaDescription
      : fallbackDescription;

  return {
    product: {
      id: product.id,
      storeId: product.storeId,
      slug: product.slug,
      name: product.name,
      skuRoot: product.skuRoot,
      shortDescription: product.shortDescription,
      description: product.description,
      status: mapProductStatus(product.status),
      isFeatured: product.isFeatured,
      isStandalone: product.isStandalone,
      productTypeId: product.productTypeId,
      productTypeCode: product.productType?.code ?? null,
      primaryImageId: product.primaryImageId,
      primaryImageUrl: product.primaryImage?.publicUrl ?? null,
      primaryImageStorageKey: product.primaryImage?.storageKey ?? null,
      primaryImageAltText: product.primaryImage?.altText ?? null,
      categoryLinks: product.productCategories.map((link) => ({
        id: link.id,
        categoryId: link.categoryId,
        categoryName: link.category.name,
        categorySlug: link.category.slug,
        isPrimary: link.isPrimary,
        sortOrder: link.sortOrder,
      })),
      relatedProducts: product.relatedFrom.map((link) => ({
        id: link.id,
        targetProductId: link.targetProductId,
        targetProductName: link.targetProduct.name,
        targetProductSlug: link.targetProduct.slug,
        type:
          link.type === "CROSS_SELL"
            ? "cross_sell"
            : link.type === "UP_SELL"
              ? "up_sell"
              : link.type === "ACCESSORY"
                ? "accessory"
                : link.type === "SIMILAR"
                  ? "similar"
                  : "related",
        sortOrder: link.sortOrder,
      })),
    },
    variants,
    images,
    seo: {
      title: seoMetadata?.metaTitle ?? "",
      description: seoMetadata?.metaDescription ?? "",
      canonicalPath: seoMetadata?.canonicalPath ?? null,
      indexingMode: seoMetadata?.indexingMode ?? "INDEX_FOLLOW",
      sitemapIncluded: seoMetadata?.sitemapIncluded ?? true,
      openGraphTitle: seoMetadata?.openGraphTitle ?? "",
      openGraphDescription: seoMetadata?.openGraphDescription ?? "",
      openGraphImageId: seoMetadata?.openGraphImageId ?? null,
      twitterTitle: seoMetadata?.twitterTitle ?? "",
      twitterDescription: seoMetadata?.twitterDescription ?? "",
      twitterImageId: seoMetadata?.twitterImageId ?? null,
      fallbackTitle,
      fallbackDescription,
      fallbackCanonicalPath,
      fallbackOpenGraphTitle,
      fallbackOpenGraphDescription,
    },
  };
}
