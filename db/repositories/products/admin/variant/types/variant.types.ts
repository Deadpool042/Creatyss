export type AdminProductVariantSummary = {
  id: string;
  productId: string;
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
  createdAt: Date;
  updatedAt: Date;
};

export type AdminProductVariantDetail = AdminProductVariantSummary;

export type CreateAdminProductVariantInput = {
  productId: string;
  name: string;
  colorName?: string | null;
  colorHex?: string | null;
  sku?: string | null;
  priceCents?: number | null;
  compareAtCents?: number | null;
  stockQuantity?: number | null;
  trackInventory?: boolean;
  isDefault?: boolean;
  status?: "draft" | "published" | "archived";
  sortOrder?: number;
};

export type UpdateAdminProductVariantInput = {
  id: string;
  name: string;
  colorName?: string | null;
  colorHex?: string | null;
  sku?: string | null;
  priceCents?: number | null;
  compareAtCents?: number | null;
  stockQuantity?: number | null;
  trackInventory?: boolean;
  isDefault?: boolean;
  status?: "draft" | "published" | "archived";
  sortOrder?: number;
};

export type AdminProductVariantRepositoryErrorCode =
  | "product_variant_not_found"
  | "product_variant_name_invalid"
  | "product_variant_price_invalid"
  | "product_variant_stock_invalid"
  | "product_variant_sku_conflict"
  | "product_variant_product_not_found";

export class AdminProductVariantRepositoryError extends Error {
  readonly code: AdminProductVariantRepositoryErrorCode;

  constructor(code: AdminProductVariantRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminProductVariantRepositoryError";
    this.code = code;
  }
}
