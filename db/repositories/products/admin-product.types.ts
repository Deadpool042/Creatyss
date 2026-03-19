import type {
  SimpleProductOffer,
  SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import type { ProductType } from "@/entities/product/product-input";
import type { ProductTypeCompatibilityErrorCode } from "@/entities/product/product-type-rules";

export type AdminProductStatus = "draft" | "published";

export type CreateAdminProductInput = {
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: AdminProductStatus;
  productType: ProductType;
  isFeatured: boolean;
  categoryIds: string[];
};

export type UpdateAdminProductInput = CreateAdminProductInput & {
  id: string;
};

export type UpdateAdminSimpleProductOfferInput = {
  id: string;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  stockQuantity: number;
};

export type AdminProductPublishContext = {
  status: AdminProductStatus;
  productType: ProductType;
  variantCount: number;
};

export type AdminProductRepositoryErrorCode =
  | "sku_taken"
  | "slug_taken"
  | "category_missing"
  | "product_referenced"
  | "simple_product_offer_requires_simple_product"
  | "simple_product_multiple_legacy_variants"
  | ProductTypeCompatibilityErrorCode;

export type AdminProductSummary = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  status: AdminProductStatus;
  productType: ProductType;
  isFeatured: boolean;
  categoryCount: number;
  variantCount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminProductCategoryAssignment = {
  id: string;
  name: string;
  slug: string;
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
  productType: ProductType;
  isFeatured: boolean;
  categories: AdminProductCategoryAssignment[];
  categoryIds: string[];
  simpleOfferFields: SimpleProductOfferFields;
  simpleOffer: SimpleProductOffer | null;
  createdAt: string;
  updatedAt: string;
};

export class AdminProductRepositoryError extends Error {
  readonly code: AdminProductRepositoryErrorCode;

  constructor(code: AdminProductRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
