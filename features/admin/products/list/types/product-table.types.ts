export type ProductStockState = "in-stock" | "low-stock" | "out-of-stock" | "unknown";

export type ProductSortOption = "updated-desc" | "updated-asc" | "name-asc" | "name-desc";

export type ProductFilterCategoryOption = {
  id: string;
  slug: string;
  name: string;
  parentId: string | null;
  parentName: string | null;
};

export type ProductFilterStockOption = "all" | ProductStockState;
export type ProductFilterVariantOption = "all" | "simple" | "variable";
export type ProductFilterImageOption = "all" | "with-image" | "without-image";
export type ProductFilterFeaturedOption = "all" | "featured" | "standard";

export type ProductTableItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: "draft" | "published" | "archived";

  stockQuantity: number;
  stockState: ProductStockState;
  stockLabel: string;

  variantCount: number;

  priceLabel: string;
  compareAtPriceLabel: string | null;
  hasPromotion: boolean;
  priceValue: number | null;

  categoryPathLabel: string | null;
  categorySlug: string | null;
  categoryId: string | null;

  primaryImageUrl: string | null;
  primaryImageAlt: string | null;

  isFeatured: boolean;
  updatedAt: string;

  diagnostics: {
    missingPrimaryImage: boolean;
    missingPrice: boolean;
  };
};
