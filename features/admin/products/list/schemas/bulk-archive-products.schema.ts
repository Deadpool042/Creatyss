import { z } from "zod";

export const bulkArchiveProductsSchema = z.object({
  productIds: z.array(z.string().trim().min(1)).min(1, "Aucun produit sélectionné."),
});

export type BulkArchiveProductsSchema = z.infer<typeof bulkArchiveProductsSchema>;
