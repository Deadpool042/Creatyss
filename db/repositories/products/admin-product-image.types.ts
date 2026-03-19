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

export class AdminProductImageRepositoryError extends Error {
  readonly code: "variant_missing";

  constructor(message: string) {
    super(message);
    this.code = "variant_missing";
  }
}
