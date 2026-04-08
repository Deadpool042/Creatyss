export type AdminProductListCategory = {
  id: string;
  slug: string;
  name: string;
  parentName: string | null;
};

export type AdminProductListPriceSummary = {
  minAmount: string | null;
  maxAmount: string | null;
  minCompareAtAmount: string | null;
  hasPriceRange: boolean;
  hasPromotion: boolean;
};

export type AdminProductListItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  productType: "simple" | "variable";
  variantCount: number;
  categoryCount: number;
  primaryCategory: AdminProductListCategory | null;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  amount: string | null;
  compareAtAmount: string | null;
  priceSummary: AdminProductListPriceSummary;
  updatedAt: string;
  stockQuantity: number;
  stockState: "in-stock" | "low-stock" | "out-of-stock";
  diagnostics: {
    missingPrimaryImage: boolean;
    missingPrice: boolean;
  };
};
