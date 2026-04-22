import type { Prisma } from "@/prisma-generated/client";

export const PRODUCT_EDITOR_CORE_SELECT = {
  id: true,
  storeId: true,
  slug: true,
  name: true,
  skuRoot: true,
  shortDescription: true,
  description: true,
  status: true,
  isFeatured: true,
  archivedAt: true,
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
  characteristics: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      label: true,
      value: true,
      sortOrder: true,
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
        select: {
          storeId: true,
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
        select: {
          storeId: true,
          onHandQuantity: true,
          reservedQuantity: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export const PRODUCT_EDITOR_MEDIA_REFERENCE_SELECT = {
  id: true,
  assetId: true,
  subjectType: true,
  subjectId: true,
  role: true,
  sortOrder: true,
  asset: {
    select: {
      publicUrl: true,
      storageKey: true,
      altText: true,
      originalFilename: true,
      mimeType: true,
    },
  },
} satisfies Prisma.MediaReferenceSelect;

export const PRODUCT_EDITOR_SEO_METADATA_SELECT = {
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
} satisfies Prisma.SeoMetadataSelect;
