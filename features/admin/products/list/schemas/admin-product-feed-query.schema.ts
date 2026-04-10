import { z } from "zod";

export const adminProductFeedQuerySchema = z.object({
  cursorUpdatedAt: z.string().datetime().optional(),
  cursorId: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});

export type AdminProductFeedQuerySchema = typeof adminProductFeedQuerySchema;
