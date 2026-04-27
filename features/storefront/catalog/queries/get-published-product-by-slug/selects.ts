import type { Prisma } from "@/prisma-generated/client";

export const PUBLISHED_PRODUCT_CORE_SELECT = {
  id: true,
  storeId: true,
  slug: true,
  name: true,
  marketingHook: true,
  shortDescription: true,
  description: true,
  isStandalone: true,
  primaryImage: {
    select: {
      storageKey: true,
      altText: true,
    },
  },
  prices: {
    where: { isActive: true, archivedAt: null },
    orderBy: { createdAt: "asc" as const },
    take: 1,
    select: {
      amount: true,
      compareAtAmount: true,
    },
  },
  variants: {
    where: {
      status: "ACTIVE",
      archivedAt: null,
    },
    orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      sku: true,
      name: true,
      isDefault: true,
      barcode: true,
      externalReference: true,
      weightGrams: true,
      widthMm: true,
      heightMm: true,
      depthMm: true,
      primaryImage: {
        select: {
          storageKey: true,
          altText: true,
        },
      },
      inventoryItems: {
        where: {
          status: "ACTIVE",
          archivedAt: null,
        },
        select: {
          onHandQuantity: true,
          reservedQuantity: true,
        },
      },
      prices: {
        where: {
          isActive: true,
          archivedAt: null,
        },
        orderBy: {
          createdAt: "asc" as const,
        },
        take: 1,
        select: {
          amount: true,
          compareAtAmount: true,
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
    },
  },
  relatedFrom: {
    where: {
      targetProduct: {
        status: "ACTIVE",
        archivedAt: null,
      },
    },
    orderBy: { sortOrder: "asc" },
    select: {
      type: true,
      targetProduct: {
        select: {
          id: true,
          slug: true,
          name: true,
          shortDescription: true,
          primaryImage: {
            select: {
              storageKey: true,
              altText: true,
            },
          },
        },
      },
    },
  },
  characteristics: {
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      label: true,
      value: true,
    },
  },
} satisfies Prisma.ProductSelect;

export const PUBLISHED_PRODUCT_SEO_SELECT = {
  metaTitle: true,
  metaDescription: true,
  indexingMode: true,
  canonicalPath: true,
  openGraphTitle: true,
  openGraphDescription: true,
  openGraphImage: {
    select: {
      storageKey: true,
    },
  },
  twitterTitle: true,
  twitterDescription: true,
  twitterImage: {
    select: {
      storageKey: true,
    },
  },
} satisfies Prisma.SeoMetadataSelect;

export const PUBLISHED_PRODUCT_GALLERY_SELECT = {
  asset: {
    select: {
      storageKey: true,
      altText: true,
    },
  },
} satisfies Prisma.MediaReferenceSelect;
