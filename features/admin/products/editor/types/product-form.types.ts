import type { ProductLifecycleStatus } from "@/entities/product";
import type { SeoIndexingMode } from "@/entities/seo";

import type { AdminProductAvailabilityStatus } from "./product-variant.types";

export type ProductCategoriesFormValues = {
  id: string;
  categoryIds: string[];
  primaryCategoryId: string;
};

export type ProductCategoriesFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"id" | "categoryIds" | "primaryCategoryId", string>>;
};

export const productCategoriesFormInitialState: ProductCategoriesFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductCategoriesFormAction = (
  prevState: ProductCategoriesFormState,
  formData: FormData
) => Promise<ProductCategoriesFormState>;

export type ProductGeneralFormValues = {
  productId: string;
  name: string;
  slug: string;
  skuRoot: string;
  marketingHook: string;
  shortDescription: string;
  description: string;
  careInstructions: string;
  status: ProductLifecycleStatus;
  isFeatured: boolean;
  productTypeId: string;
  primaryImageId: string;
};

export type ProductGeneralFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      | "productId"
      | "name"
      | "slug"
      | "skuRoot"
      | "marketingHook"
      | "shortDescription"
      | "description"
      | "careInstructions"
      | "status"
      | "isFeatured"
      | "productTypeId"
      | "primaryImageId",
      string
    >
  >;
};

export const productGeneralFormInitialState: ProductGeneralFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductGeneralFormAction = (
  prevState: ProductGeneralFormState,
  formData: FormData
) => Promise<ProductGeneralFormState>;

export type ProductAvailabilityRowInput = {
  variantId: string;
  status: AdminProductAvailabilityStatus;
  isSellable: boolean;
  backorderAllowed: boolean;
  sellableFrom: Date | null;
  sellableUntil: Date | null;
  preorderStartsAt: Date | null;
  preorderEndsAt: Date | null;
};

export type ProductAvailabilityFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const productAvailabilityFormInitialState: ProductAvailabilityFormState = {
  status: "idle",
  message: null,
};

export type ProductAvailabilityFormAction = (
  prevState: ProductAvailabilityFormState,
  formData: FormData
) => Promise<ProductAvailabilityFormState>;

export type ProductInventoryRowInput = {
  variantId: string;
  onHandQuantity: number;
  lowStockThreshold?: number | null;
};

export type ProductInventoryFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const productInventoryFormInitialState: ProductInventoryFormState = {
  status: "idle",
  message: null,
};

export type ProductInventoryFormAction = (
  prevState: ProductInventoryFormState,
  formData: FormData
) => Promise<ProductInventoryFormState>;

export type ProductRelatedProductsFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
};

export const productRelatedProductsFormInitialState: ProductRelatedProductsFormState = {
  status: "idle",
  message: null,
};

export type ProductRelatedProductsFormAction = (
  prevState: ProductRelatedProductsFormState,
  formData: FormData
) => Promise<ProductRelatedProductsFormState>;

export type ProductSeoFormValues = {
  productId: string;
  title: string;
  description: string;
  canonicalPath: string;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageId: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImageId: string;
};

export type ProductSeoFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<
    Record<
      | "productId"
      | "title"
      | "description"
      | "canonicalPath"
      | "indexingMode"
      | "sitemapIncluded"
      | "openGraphTitle"
      | "openGraphDescription"
      | "openGraphImageId"
      | "twitterTitle"
      | "twitterDescription"
      | "twitterImageId",
      string
    >
  >;
};

export const productSeoFormInitialState: ProductSeoFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductSeoFormAction = (
  prevState: ProductSeoFormState,
  formData: FormData
) => Promise<ProductSeoFormState>;

export type AdminPriceEntry = {
  id: string | null;
  priceListId: string;
  amount: string | null;
  compareAtAmount: string | null;
  costAmount: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

export type AdminVariantPriceEntry = {
  variantId: string;
  variantName: string | null;
  variantSku: string;
  prices: AdminPriceEntry[];
};

export type AdminProductPricingData = {
  productId: string;
  productPrices: AdminPriceEntry[];
  variantPrices: AdminVariantPriceEntry[];
};

export type ProductPricingFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<string, string>>;
};

export const productPricingFormInitialState: ProductPricingFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type ProductPricingFormAction = (
  prevState: ProductPricingFormState,
  formData: FormData
) => Promise<ProductPricingFormState>;

export type AdminProductCharacteristicItem = {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
};

export type ProductCharacteristicsFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Partial<Record<"productId" | "characteristics", string>>;
  rowErrors: Record<number, Partial<Record<"label" | "value", string>>>;
};

export const productCharacteristicsFormInitialState: ProductCharacteristicsFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
  rowErrors: {},
};

export type ProductCharacteristicsFormAction = (
  prevState: ProductCharacteristicsFormState,
  formData: FormData
) => Promise<ProductCharacteristicsFormState>;
