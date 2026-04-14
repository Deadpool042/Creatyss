import { z } from "zod";

export const bulkRestoreProductsSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
});

export type BulkRestoreProductsSchema = z.infer<typeof bulkRestoreProductsSchema>;
