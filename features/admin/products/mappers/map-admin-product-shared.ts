import type {
  AdminProductCategoryLink,
  AdminProductPrimaryImage,
  AdminProductRecord,
  AdminProductSummary,
  AdminProductTypeOption,
  AdminProductVariantSummary,
  AdminRelatedProductLink,
} from "../types";
import {
  mapAdminProductStatus,
  mapAdminProductVariantStatus,
} from "./map-admin-product-status";
import { mapAdminRelatedProductType } from "./map-admin-related-product-type";

function toIsoString(value: Date): string {
  return value.toISOString();
}

type ProductTypeRecord = {
  id: string;
  code: string;
  name: string;
  slug: string;
  isActive: boolean;
} | null;

type MediaAssetRecord = {
  id: string;
  storageKey: string;
  originalName: string | null;
  mimeType: string | null;
} | null;

type ProductCategoryLinkRecord = {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

type RelatedProductLinkRecord = {
  id: string;
  type: Parameters<typeof mapAdminRelatedProductType>[0];
  sortOrder: number;
  targetProduct: {
    id: string;
    name: string;
    slug: string;
  };
};

type ProductVariantRecord = {
  id: string;
  sku: string;
  slug: string | null;
  name: string | null;
  status: Parameters<typeof mapAdminProductVariantStatus>[0];
  isDefault: boolean;
  sortOrder: number;
  primaryImage: MediaAssetRecord;
};

type ProductSummaryRecord = {
  id: string;
  name: string;
  slug: string;
  skuRoot: string | null;
  status: Parameters<typeof mapAdminProductStatus>[0];
  isFeatured: boolean;
  isStandalone: boolean;
  productType: ProductTypeRecord;
  primaryImage: MediaAssetRecord;
  productCategories: ProductCategoryLinkRecord[];
  _count: {
    variants: number;
  };
  updatedAt: Date;
};

type ProductRecord = {
  id: string;
  name: string;
  slug: string;
  skuRoot: string | null;
  shortDescription: string | null;
  description: string | null;
  status: Parameters<typeof mapAdminProductStatus>[0];
  isFeatured: boolean;
  isStandalone: boolean;
  productType: ProductTypeRecord;
  primaryImage: MediaAssetRecord;
  productCategories: ProductCategoryLinkRecord[];
  relatedFrom: RelatedProductLinkRecord[];
  variants: ProductVariantRecord[];
  createdAt: Date;
  updatedAt: Date;
};

export function mapAdminProductTypeOption(
  productType: ProductTypeRecord
): AdminProductTypeOption | null {
  if (productType === null) {
    return null;
  }

  return {
    id: productType.id,
    code: productType.code,
    name: productType.name,
    slug: productType.slug,
    isActive: productType.isActive,
  };
}

export function mapAdminProductPrimaryImage(
  image: MediaAssetRecord
): AdminProductPrimaryImage {
  if (image === null) {
    return null;
  }

  return {
    id: image.id,
    storageKey: image.storageKey,
    originalName: image.originalName,
    mimeType: image.mimeType,
  };
}

export function mapAdminProductCategoryLink(
  link: ProductCategoryLinkRecord
): AdminProductCategoryLink {
  return {
    id: link.id,
    categoryId: link.category.id,
    categoryName: link.category.name,
    categorySlug: link.category.slug,
    isPrimary: link.isPrimary,
    sortOrder: link.sortOrder,
  };
}

export function mapAdminRelatedProductLink(
  link: RelatedProductLinkRecord
): AdminRelatedProductLink {
  return {
    id: link.id,
    targetProductId: link.targetProduct.id,
    targetProductName: link.targetProduct.name,
    targetProductSlug: link.targetProduct.slug,
    type: mapAdminRelatedProductType(link.type),
    sortOrder: link.sortOrder,
  };
}

export function mapAdminProductVariantSummary(
  variant: ProductVariantRecord
): AdminProductVariantSummary {
  return {
    id: variant.id,
    sku: variant.sku,
    slug: variant.slug,
    name: variant.name,
    status: mapAdminProductVariantStatus(variant.status),
    isDefault: variant.isDefault,
    sortOrder: variant.sortOrder,
    primaryImage: mapAdminProductPrimaryImage(variant.primaryImage),
  };
}

export function mapAdminProductSummary(
  product: ProductSummaryRecord
): AdminProductSummary {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    skuRoot: product.skuRoot,
    status: mapAdminProductStatus(product.status),
    isFeatured: product.isFeatured,
    isStandalone: product.isStandalone,
    productType: mapAdminProductTypeOption(product.productType),
    primaryImage: mapAdminProductPrimaryImage(product.primaryImage),
    categoryLinks: product.productCategories.map(mapAdminProductCategoryLink),
    variantCount: product._count.variants,
    updatedAt: toIsoString(product.updatedAt),
  };
}

export function mapAdminProductRecord(
  product: ProductRecord
): AdminProductRecord {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    skuRoot: product.skuRoot,
    shortDescription: product.shortDescription,
    description: product.description,
    status: mapAdminProductStatus(product.status),
    isFeatured: product.isFeatured,
    isStandalone: product.isStandalone,
    productType: mapAdminProductTypeOption(product.productType),
    primaryImage: mapAdminProductPrimaryImage(product.primaryImage),
    categoryLinks: product.productCategories.map(mapAdminProductCategoryLink),
    relatedProducts: product.relatedFrom.map(mapAdminRelatedProductLink),
    variants: product.variants.map(mapAdminProductVariantSummary),
    createdAt: toIsoString(product.createdAt),
    updatedAt: toIsoString(product.updatedAt),
  };
}
