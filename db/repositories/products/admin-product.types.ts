import type {
  SimpleProductOffer,
  SimpleProductOfferFields,
} from "@/entities/product/simple-product-offer";
import type { ProductType } from "@/entities/product/product-input";
import type { ProductTypeCompatibilityErrorCode } from "@/entities/product/product-type-rules";

type AdminProductStatus = "draft" | "published";

type ProductRepositoryErrorCode =
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
  readonly code: ProductRepositoryErrorCode;

  constructor(code: ProductRepositoryErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}
