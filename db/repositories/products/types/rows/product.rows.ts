import type { Prisma } from "@prisma/client";
import { productCategorySelect, productVariantSelect } from "./variant.rows";
import { productImageSelect } from "./image.rows";

export const productSummarySelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  status: true,
  productType: true,
  productKind: true,
  isFeatured: true,
  seoTitle: true,
  seoDescription: true,
  publishedAt: true,
  simpleSku: true,
  simplePriceCents: true,
  simpleCompareAtCents: true,
  simpleStockQuantity: true,
  trackInventory: true,
  createdAt: true,
  updatedAt: true,
  images: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
    take: 1,
    select: {
      mediaAsset: {
        select: {
          storageKey: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

export const productDetailSelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  description: true,
  status: true,
  productType: true,
  productKind: true,
  isFeatured: true,
  seoTitle: true,
  seoDescription: true,
  publishedAt: true,
  simpleSku: true,
  simplePriceCents: true,
  simpleCompareAtCents: true,
  simpleStockQuantity: true,
  trackInventory: true,
  createdAt: true,
  updatedAt: true,
  productCategories: {
    orderBy: [{ category: { name: "asc" } }],
    select: productCategorySelect,
  },
  images: {
    orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
    select: productImageSelect,
  },
  variants: {
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: productVariantSelect,
  },
} satisfies Prisma.ProductSelect;

export type ProductSummaryRow = Prisma.ProductGetPayload<{
  select: typeof productSummarySelect;
}>;

export type ProductDetailRow = Prisma.ProductGetPayload<{
  select: typeof productDetailSelect;
}>;
