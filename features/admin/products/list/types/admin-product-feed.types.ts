import { z } from "zod";

import { productFeedCursorSchema } from "@/features/products/types";

export const adminProductFeedQuerySchema = z.object({
  limit: z.number().int().min(1).max(48).default(12),
  cursor: productFeedCursorSchema.nullable().optional(),
  search: z.string().trim().max(255).optional(),
});

export type AdminProductFeedQuery = z.infer<typeof adminProductFeedQuerySchema>;

export type AdminProductFeedItem = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  status: "draft" | "published" | "archived";

  primaryImageUrl: string | null;
  primaryImageAlt: string | null;

  stockQuantity: number;
  stockState: "in-stock" | "low-stock" | "out-of-stock" | "unknown";
  variantCount: number;

  priceLabel: string;
  compareAtPriceLabel: string | null;
  hasPromotion: boolean;
  priceValue: number | null;

  categoryPathLabel: string | null;
  categorySlug: string | null;
  categoryId: string | null;

  isFeatured: boolean;
  updatedAt: string;
};

export type AdminProductFeedPageResult = {
  items: AdminProductFeedItem[];
  nextCursor: {
    updatedAt: string;
    id: string;
  } | null;
  hasMore: boolean;
};
