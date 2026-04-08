import { z } from "zod";

export const deleteProductImageSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
});

export type DeleteProductImageSchemaInput = z.input<typeof deleteProductImageSchema>;
export type DeleteProductImageSchemaValues = z.infer<typeof deleteProductImageSchema>;
