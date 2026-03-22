import type { Prisma } from "@prisma/client";

export const productImageSelect = {
  id: true,
  productId: true,
  mediaAssetId: true,
  isPrimary: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  mediaAsset: {
    select: {
      storageKey: true,
      altText: true,
    },
  },
} satisfies Prisma.ProductImageSelect;

export const productVariantImageSelect = {
  id: true,
  productVariantId: true,
  mediaAssetId: true,
  isPrimary: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  mediaAsset: {
    select: {
      storageKey: true,
      altText: true,
    },
  },
} satisfies Prisma.ProductVariantImageSelect;

export const adminProductImageSelect = {
  id: true,
  productId: true,
  mediaAssetId: true,
  isPrimary: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  mediaAsset: {
    select: {
      storageKey: true,
      altText: true,
    },
  },
} satisfies Prisma.ProductImageSelect;

export const adminProductVariantImageSelect = {
  id: true,
  productVariantId: true,
  mediaAssetId: true,
  isPrimary: true,
  sortOrder: true,
  createdAt: true,
  updatedAt: true,
  mediaAsset: {
    select: {
      storageKey: true,
      altText: true,
    },
  },
} satisfies Prisma.ProductVariantImageSelect;

export type AdminProductImageRow = Prisma.ProductImageGetPayload<{
  select: typeof adminProductImageSelect;
}>;

export type AdminProductVariantImageRow = Prisma.ProductVariantImageGetPayload<{
  select: typeof adminProductVariantImageSelect;
}>;
