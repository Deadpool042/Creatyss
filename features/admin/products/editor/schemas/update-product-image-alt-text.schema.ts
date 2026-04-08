import { z } from "zod";

export const updateProductImageAltTextSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
  altText: z.string().max(255, "255 caractères maximum.").default(""),
});

export type UpdateProductImageAltTextSchemaInput = z.input<typeof updateProductImageAltTextSchema>;
export type UpdateProductImageAltTextSchemaValues = z.infer<typeof updateProductImageAltTextSchema>;
