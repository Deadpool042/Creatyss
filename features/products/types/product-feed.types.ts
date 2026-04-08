import { z } from "zod";

export const productFeedCursorSchema = z.object({
  updatedAt: z.string().datetime(),
  id: z.string().min(1),
});

export const productFeedQuerySchema = z.object({
  limit: z.number().int().min(1).max(48).default(12),
  cursor: productFeedCursorSchema.nullable().optional(),
  search: z.string().trim().max(255).optional(),
});

export type ProductFeedCursor = z.infer<typeof productFeedCursorSchema>;
export type ProductFeedQuery = z.infer<typeof productFeedQuerySchema>;

export type ProductFeedPageResult<TItem> = {
  items: TItem[];
  nextCursor: ProductFeedCursor | null;
  hasMore: boolean;
};
