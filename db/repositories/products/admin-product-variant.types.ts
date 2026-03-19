import type { ProductTypeCompatibilityErrorCode } from "@/entities/product/product-type-rules";

export type AdminProductVariantStatus = "draft" | "published";

export type CreateAdminProductVariantInput = {
  productId: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: AdminProductVariantStatus;
};

export type UpdateAdminProductVariantInput = CreateAdminProductVariantInput & {
  id: string;
};

export type AdminProductVariantRepositoryErrorCode =
  | "sku_taken"
  | ProductTypeCompatibilityErrorCode;

export type AdminProductVariant = {
  id: string;
  productId: string;
  name: string;
  colorName: string;
  colorHex: string | null;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
  isDefault: boolean;
  status: AdminProductVariantStatus;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
};

export class AdminProductVariantRepositoryError extends Error {
  readonly code: AdminProductVariantRepositoryErrorCode;

  constructor(code: AdminProductVariantRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
