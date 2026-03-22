import type { AdminProductDetail, AdminProductSummary } from "@db-products/admin";
import type { ProductCategorySummary, ProductDetail, ProductSummary } from "@db-products/public";
import type { ProductDetailRow, ProductSummaryRow } from "@db-products/types/rows";
import { mapProductImageSummary } from "./image.mapper";
import { mapProductVariantSummary } from "./variant.mapper";

function mapProductCategorySummary(
  row: ProductDetailRow["productCategories"][number]
): ProductCategorySummary {
  return {
    id: row.category.id,
    slug: row.category.slug,
    name: row.category.name,
  };
}

export function mapProductSummary(row: ProductSummaryRow): ProductSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    status: row.status,
    productType: row.productType,
    productKind: row.productKind,
    isFeatured: row.isFeatured,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    publishedAt: row.publishedAt,
    simpleSku: row.simpleSku,
    simplePriceCents: row.simplePriceCents,
    simpleCompareAtCents: row.simpleCompareAtCents,
    simpleStockQuantity: row.simpleStockQuantity,
    trackInventory: row.trackInventory,
    primaryImageStorageKey: row.images[0]?.mediaAsset.storageKey ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapProductDetail(row: ProductDetailRow): ProductDetail {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    status: row.status,
    productType: row.productType,
    productKind: row.productKind,
    isFeatured: row.isFeatured,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    publishedAt: row.publishedAt,
    simpleSku: row.simpleSku,
    simplePriceCents: row.simplePriceCents,
    simpleCompareAtCents: row.simpleCompareAtCents,
    simpleStockQuantity: row.simpleStockQuantity,
    trackInventory: row.trackInventory,
    categories: row.productCategories.map(mapProductCategorySummary),
    images: row.images.map(mapProductImageSummary),
    variants: row.variants.map(mapProductVariantSummary),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminProductSummary(row: ProductSummaryRow): AdminProductSummary {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    status: row.status,
    productType: row.productType,
    productKind: row.productKind,
    isFeatured: row.isFeatured,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    publishedAt: row.publishedAt,
    simpleSku: row.simpleSku,
    simplePriceCents: row.simplePriceCents,
    simpleCompareAtCents: row.simpleCompareAtCents,
    simpleStockQuantity: row.simpleStockQuantity,
    trackInventory: row.trackInventory,
    primaryImageStorageKey: row.images[0]?.mediaAsset.storageKey ?? null,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function mapAdminProductDetail(row: ProductDetailRow): AdminProductDetail {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    status: row.status,
    productType: row.productType,
    productKind: row.productKind,
    isFeatured: row.isFeatured,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    publishedAt: row.publishedAt,
    simpleSku: row.simpleSku,
    simplePriceCents: row.simplePriceCents,
    simpleCompareAtCents: row.simpleCompareAtCents,
    simpleStockQuantity: row.simpleStockQuantity,
    trackInventory: row.trackInventory,
    categoryIds: row.productCategories.map((entry) => entry.category.id),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
