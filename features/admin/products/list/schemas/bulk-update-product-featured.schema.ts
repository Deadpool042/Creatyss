import { z } from "zod";

export const bulkUpdateProductFeaturedSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
  isFeatured: z.boolean(),
});

export type BulkUpdateProductFeaturedSchema = z.infer<typeof bulkUpdateProductFeaturedSchema>;
