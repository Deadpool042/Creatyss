import { z } from "zod";

export const setProductPrimaryImageSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
});

export type SetProductPrimaryImageSchemaInput = z.input<typeof setProductPrimaryImageSchema>;
export type SetProductPrimaryImageSchemaValues = z.infer<typeof setProductPrimaryImageSchema>;
