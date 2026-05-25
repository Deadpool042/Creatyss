import type {
  ProductTableStatus,
  ProductStockState,
} from "./product-table.types";

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
