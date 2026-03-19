import type { ProductTypeCompatibilityErrorCode } from "@/entities/product/product-type-rules";

type AdminProductVariantStatus = "draft" | "published";

type VariantRepositoryErrorCode = "sku_taken" | ProductTypeCompatibilityErrorCode;

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
  readonly code: VariantRepositoryErrorCode;

  constructor(code: VariantRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
