import type {
  ProductLifecycleStatus,
  ProductRelatedType,
  ProductVariantLifecycleStatus,
} from "@/entities/product";

export type AdminProductLifecycleStatus = ProductLifecycleStatus;

export type AdminProductVariantLifecycleStatus = ProductVariantLifecycleStatus;

export type AdminRelatedProductType = ProductRelatedType;

export type AdminProductTypeOption = {
  id: string;
  code: string;
  name: string;
  slug: string;
  isActive: boolean;
};

export type AdminProductPrimaryImage = {
  id: string;
  storageKey: string;
  originalName: string | null;
  mimeType: string | null;
} | null;

export type AdminProductCategoryLink = {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminRelatedProductLink = {
  id: string;
  targetProductId: string;
  targetProductName: string;
  targetProductSlug: string;
  type: AdminRelatedProductType;
  sortOrder: number;
};

export type AdminProductVariantSummary = {
  id: string;
  sku: string;
  slug: string | null;
  name: string | null;
  status: AdminProductVariantLifecycleStatus;
  isDefault: boolean;
  sortOrder: number;
  primaryImage: AdminProductPrimaryImage;
};

export type AdminProductSummary = {
  id: string;
  name: string;
  slug: string;
  skuRoot: string | null;
  status: AdminProductLifecycleStatus;
  isFeatured: boolean;
  isStandalone: boolean;
  productType: AdminProductTypeOption | null;
  primaryImage: AdminProductPrimaryImage;
  categoryLinks: readonly AdminProductCategoryLink[];
  variantCount: number;
  updatedAt: string;
};

export type AdminProductRecord = {
  id: string;
  name: string;
  slug: string;
  skuRoot: string | null;
  shortDescription: string | null;
  description: string | null;
  status: AdminProductLifecycleStatus;
  isFeatured: boolean;
  isStandalone: boolean;
  productType: AdminProductTypeOption | null;
  primaryImage: AdminProductPrimaryImage;
  categoryLinks: readonly AdminProductCategoryLink[];
  relatedProducts: readonly AdminRelatedProductLink[];
  variants: readonly AdminProductVariantSummary[];
  createdAt: string;
  updatedAt: string;
};
