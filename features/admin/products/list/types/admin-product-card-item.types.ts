import type { ProductPickerItem } from "./product-list-query.types";
import type { ProductStockState } from "./product-table.types";

export type AdminProductStatus = "draft" | "active" | "inactive" | "archived";
export type ProductFeaturedFilter = "featured" | "not-featured";
export type ProductType = "simple" | "variable" | "typed";

export type AdminProductListPriceSummary = {
  minAmount: string | null;
  maxAmount: string | null;
  minCompareAtAmount: string | null;
  hasPriceRange: boolean;
  hasPromotion: boolean;
};

export type AdminProductCardItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: AdminProductStatus;
  isFeatured: boolean;
  productType: ProductType;
  productTypeCode: string | null;
  variantCount: number;
  categoryCount: number;
  primaryCategory: ProductPickerItem | null;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  amount: string | null;
  compareAtAmount: string | null;
  priceSummary: AdminProductListPriceSummary;
  updatedAt: string;
  stockQuantity: number;
  stockState: ProductStockState;
  diagnostics: {
    missingPrimaryImage: boolean;
    missingPrice: boolean;
  };
};
