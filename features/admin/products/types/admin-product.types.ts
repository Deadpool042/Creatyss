export type AdminProductStatus = "draft" | "active" | "inactive" | "archived";
export type AdminProductType = "simple" | "variable";
export type AdminProductVariantStatus = "draft" | "active" | "inactive" | "archived";

export type AdminProductCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminRelatedProductOption = {
  id: string;
  name: string;
  slug: string;
};

export type AdminProductImageRow = {
  id: string;
  mediaAssetId: string;
  filePath: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  variantId: string | null;
};

export type AdminProductVariantRow = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  colorName: string | null;
  position: number;
  status: AdminProductVariantStatus;
  isDefault: boolean;
};

export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  status: AdminProductStatus;
  productType: AdminProductType;
  isFeatured: boolean;
  categoryNames: readonly string[];
  variantCount: number;
  updatedAt: string;
};

export type AdminProductDetail = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: AdminProductStatus;
  productType: AdminProductType;
  isFeatured: boolean;
  categoryIds: readonly string[];
  relatedProductIds: readonly string[];
  variants: readonly AdminProductVariantRow[];
  images: readonly AdminProductImageRow[];
  createdAt: string;
  updatedAt: string;
};

export type CreateAdminProductInput = {
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: AdminProductStatus;
  productType: AdminProductType;
  isFeatured: boolean;
  categoryIds: readonly string[];
  relatedProductIds: readonly string[];
};

export type UpdateAdminProductInput = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: AdminProductStatus;
  productType: AdminProductType;
  isFeatured: boolean;
  categoryIds: readonly string[];
  relatedProductIds: readonly string[];
};

export type CreateAdminProductVariantInput = {
  productId: string;
  name: string;
  slug: string;
  sku: string | null;
  colorName: string | null;
  position: number;
  status: AdminProductVariantStatus;
  isDefault: boolean;
};

export type UpdateAdminProductVariantInput = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  sku: string | null;
  colorName: string | null;
  position: number;
  status: AdminProductVariantStatus;
  isDefault: boolean;
};

export type AttachAdminProductImageInput = {
  productId: string;
  mediaAssetId: string;
  variantId: string | null;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type UpdateAdminProductImageInput = {
  imageId: string;
  productId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type ReorderAdminProductImageInput = {
  imageId: string;
  productId: string;
  sortOrder: number;
};

export type AdminProductServiceErrorCode =
  | "product_missing"
  | "variant_missing"
  | "image_missing"
  | "slug_taken"
  | "variant_slug_taken"
  | "category_missing"
  | "related_product_missing"
  | "media_asset_missing"
  | "cannot_delete_default_variant"
  | "default_variant_required"
  | "invalid_product_type_transition";

export class AdminProductServiceError extends Error {
  readonly code: AdminProductServiceErrorCode;

  constructor(code: AdminProductServiceErrorCode, message?: string) {
    super(message ?? code);
    this.name = "AdminProductServiceError";
    this.code = code;
  }
}
