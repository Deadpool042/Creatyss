import type { ProductKind, ProductStatus, ProductType } from "@db-products/public/product.types";

export type AdminProductSummary = {
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

export type AdminProductDetail = {
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
  categoryIds: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminProductInput = {
  slug: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  status?: ProductStatus;
  productType: ProductType;
  productKind: ProductKind;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: Date | null;
  simpleSku?: string | null;
  simplePriceCents?: number | null;
  simpleCompareAtCents?: number | null;
  simpleStockQuantity?: number | null;
  trackInventory?: boolean;
  categoryIds?: string[];
};

export type UpdateAdminProductInput = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  description?: string | null;
  status?: ProductStatus;
  productType: ProductType;
  productKind: ProductKind;
  isFeatured?: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  publishedAt?: Date | null;
  simpleSku?: string | null;
  simplePriceCents?: number | null;
  simpleCompareAtCents?: number | null;
  simpleStockQuantity?: number | null;
  trackInventory?: boolean;
  categoryIds?: string[];
};

export type AdminProductRepositoryErrorCode =
  | "product_not_found"
  | "product_slug_invalid"
  | "product_name_invalid"
  | "product_type_invalid"
  | "product_kind_invalid"
  | "product_price_invalid"
  | "product_stock_invalid"
  | "product_category_invalid"
  | "product_slug_conflict"
  | "product_simple_variant_mismatch"
  | "product_digital_inventory_invalid"
  | "product_digital_type_invalid"
  | "product_digital_deliverable_required"
  | "product_pattern_detail_required";

export class AdminProductRepositoryError extends Error {
  readonly code: AdminProductRepositoryErrorCode;

  constructor(code: AdminProductRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminProductRepositoryError";
    this.code = code;
  }
}
