import { z } from "zod";

export const bulkUpdateProductStatusSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
  status: z.enum(["draft", "active", "inactive", "archived"]),
});

export type BulkUpdateProductStatusSchema = z.infer<typeof bulkUpdateProductStatusSchema>;
