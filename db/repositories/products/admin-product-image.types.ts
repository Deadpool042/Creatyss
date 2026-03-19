export type AdminProductImage = {
  id: string;
  productId: string;
  variantId: string | null;
  filePath: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateAdminProductImageInput = {
  productId: string;
  variantId: string | null;
  filePath: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type UpdateAdminProductImageInput = {
  id: string;
  productId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
};

export type UpsertAdminPrimaryProductImageInput = {
  productId: string;
  filePath: string;
};

export type UpsertAdminPrimaryVariantImageInput = {
  productId: string;
  variantId: string;
  filePath: string;
};

export type AdminProductImageRepositoryErrorCode = "variant_missing";

export class AdminProductImageRepositoryError extends Error {
  readonly code: AdminProductImageRepositoryErrorCode;

  constructor(message: string) {
    super(message);
    this.code = "variant_missing";
  }
}
