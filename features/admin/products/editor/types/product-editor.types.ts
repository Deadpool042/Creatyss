import type { SeoIndexingMode } from "@/prisma-generated/client";
import type {
  AdminProductVariantListItem,
  AdminProductVariantStatus,
} from "./product-variants.types";
export type { AdminProductVariantListItem, AdminProductVariantStatus };
import type { AdminProductImageItem } from "./product-images.types";
export type { AdminProductImageItem };

export type AdminProductEditorStatus = "draft" | "active" | "inactive" | "archived";

export type AdminRelatedProductEditorType =
  | "related"
  | "cross_sell"
  | "up_sell"
  | "accessory"
  | "similar";

export type AdminProductEditorCategoryLink = {
  id: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  isPrimary: boolean;
  sortOrder: number;
};

export type AdminProductEditorRelatedProduct = {
  id: string;
  targetProductId: string;
  targetProductName: string;
  targetProductSlug: string;
  type: AdminRelatedProductEditorType;
  sortOrder: number;
};

export type AdminProductEditorSeo = {
  title: string;
  description: string;
  canonicalPath: string | null;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageId: string | null;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageId: string | null;
  fallbackTitle: string;
  fallbackDescription: string;
  fallbackCanonicalPath: string;
  fallbackOpenGraphTitle: string;
  fallbackOpenGraphDescription: string;
};

export type AdminProductEditorProduct = {
  id: string;
  storeId: string;
  slug: string;
  name: string;
  skuRoot: string | null;
  shortDescription: string | null;
  description: string | null;
  status: AdminProductEditorStatus;
  isFeatured: boolean;
  archivedAt: Date | null;
  isArchived: boolean;
  isStandalone: boolean;
  productTypeId: string | null;
  productTypeCode: string | null;
  primaryImageId: string | null;
  primaryImageUrl: string | null;
  primaryImageStorageKey: string | null;
  primaryImageAltText: string | null;
  categoryLinks: AdminProductEditorCategoryLink[];
  relatedProducts: AdminProductEditorRelatedProduct[];
};

export type AdminProductEditorData = {
  product: AdminProductEditorProduct;
  variants: AdminProductVariantListItem[];
  images: AdminProductImageItem[];
  seo: AdminProductEditorSeo;
};
