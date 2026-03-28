export type { AdminProductListItem as AdminProductSummary } from "@/features/admin/products/list/types/product-list.types";
export type {
  AdminProductListCategory,
  AdminProductListDiagnostics,
  AdminProductListStatus,
  AdminProductListType,
} from "@/features/admin/products/list/types/product-list.types";

export type {
  AdminProductDetails,
  AdminProductDetailsCategory,
  AdminProductDetailsDiagnostics,
  AdminProductDetailsVariantOptionValue,
  AdminProductDisplayStatus,
  AdminProductDisplayType,
} from "@/features/admin/products/details/types/product-detail-types";

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
};

export type AdminMediaAsset = {
  id: string;
  filePath: string | null;
  altText: string | null;
  originalName: string | null;
  mimeType: string | null;
};

export type AdminProductImage = {
  id: string;
  filePath: string | null;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
  variantId: string | null;
};

export type AdminProductVariant = {
  id: string;
  slug: string;
  name: string | null;
  sku: string;
  status: "draft" | "published" | "archived";
  colorName: string | null;
  colorHex: string | null;
  isDefault: boolean;
  isAvailable: boolean;
  price: string;
  compareAtPrice: string;
  stockQuantity: number;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
};

export type AdminProductDetail = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  status: "draft" | "published" | "archived";
  productType: "simple" | "variable";
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  categoryIds: string[];
  simpleOffer: {
    sku: string;
    price: string;
    compareAtPrice: string | null;
    stockQuantity: number;
    isAvailable: boolean;
  } | null;
  simpleOfferFields: {
    sku: string | null;
    price: string | null;
    compareAtPrice: string | null;
    stockQuantity: number | null;
  };
};

export type PrimaryImageScope = "product" | "variant";

export type PrimaryImageState = {
  primaryImage: AdminProductImage | null;
  displayImage: AdminProductImage | null;
  extraImageCount: number;
  usesFallbackImage: boolean;
};

export type ProductDetailSearchParams = Record<string, string | string[] | undefined>;
