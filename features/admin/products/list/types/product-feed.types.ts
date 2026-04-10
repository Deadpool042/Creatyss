import type { ProductTableStatus, ProductStockState } from "./product-table.types";

export type GetAdminProductsFeedPageCursor = {
  updatedAt: string;
  id: string;
};

export type AdminProductFeedItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: ProductTableStatus;
  isFeatured: boolean;
  primaryImageUrl: string | null;
  primaryImageAlt: string | null;
  categoryNames: string[];
  categoryPathLabel: string | null;
  productTypeName: string | null;
  variantCount: number;
  stockState: ProductStockState;
  stockQuantity: number | null;
  priceLabel: string | null;
  compareAtPriceLabel: string | null;
  hasPromotion: boolean;
  updatedAt: string;
};

export type GetAdminProductsFeedPageInput = {
  limit: number;
  cursor: string | null;
  search: string | null;
  status: ProductTableStatus[];
  categoryId: string | null;
  featured: "featured" | "standard" | null;
  sort: "updated-desc";
};

export type GetAdminProductsFeedPageResult = {
  items: AdminProductFeedItem[];
  nextCursor: GetAdminProductsFeedPageCursor | null;
  hasMore: boolean;
};
