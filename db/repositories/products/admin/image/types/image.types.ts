export type AdminProductImageSummary = {
  id: string;
  productId: string | null;
  productVariantId: string | null;
  mediaAssetId: string;
  storageKey: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAdminProductImageInput = {
  productId?: string | null;
  productVariantId?: string | null;
  mediaAssetId: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type UpdateAdminProductImageInput = {
  id: string;
  isPrimary?: boolean;
  sortOrder?: number;
};

export type AdminProductImageRepositoryErrorCode =
  | "product_image_not_found"
  | "product_image_media_invalid"
  | "product_image_scope_invalid"
  | "product_image_product_not_found"
  | "product_image_variant_not_found";

export class AdminProductImageRepositoryError extends Error {
  readonly code: AdminProductImageRepositoryErrorCode;

  constructor(code: AdminProductImageRepositoryErrorCode, message: string) {
    super(message);
    this.name = "AdminProductImageRepositoryError";
    this.code = code;
  }
}
