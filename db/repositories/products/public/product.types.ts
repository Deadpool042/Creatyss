export type ProductStatus = "draft" | "published" | "archived";

export type ProductType = "simple" | "variable";

export type ProductKind = "physical" | "digital" | "hybrid";

export type ProductImageSummary = {
  id: string;
  mediaAssetId: string;
  storageKey: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductVariantSummary = {
  id: string;
  name: string;
  colorName: string | null;
  colorHex: string | null;
  sku: string | null;
  priceCents: number | null;
  compareAtCents: number | null;
  stockQuantity: number | null;
  trackInventory: boolean;
  isDefault: boolean;
  status: "draft" | "published" | "archived";
  sortOrder: number;
};

export type ProductCategorySummary = {
  id: string;
  slug: string;
  name: string;
};

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: ProductStatus;
  productType: ProductType;
  productKind: ProductKind;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  simpleSku: string | null;
  simplePriceCents: number | null;
  simpleCompareAtCents: number | null;
  simpleStockQuantity: number | null;
  trackInventory: boolean;
  primaryImageStorageKey: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ProductDetail = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  status: ProductStatus;
  productType: ProductType;
  productKind: ProductKind;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  simpleSku: string | null;
  simplePriceCents: number | null;
  simpleCompareAtCents: number | null;
  simpleStockQuantity: number | null;
  trackInventory: boolean;
  categories: ProductCategorySummary[];
  images: ProductImageSummary[];
  variants: ProductVariantSummary[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductRepositoryErrorCode = "product_not_found" | "product_slug_invalid";

export class ProductRepositoryError extends Error {
  readonly code: ProductRepositoryErrorCode;

  constructor(code: ProductRepositoryErrorCode, message: string) {
    super(message);
    this.name = "ProductRepositoryError";
    this.code = code;
  }
}
