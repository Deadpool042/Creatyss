import { z } from "zod";

export const setDefaultProductVariantSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  variantId: z.string().trim().min(1, "Variante requise."),
});

export const deleteProductVariantSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  variantId: z.string().trim().min(1, "Variante requise."),
});

export type SetDefaultProductVariantSchemaInput = z.input<typeof setDefaultProductVariantSchema>;
export type SetDefaultProductVariantSchemaValues = z.infer<typeof setDefaultProductVariantSchema>;
export type DeleteProductVariantSchemaInput = z.input<typeof deleteProductVariantSchema>;
export type DeleteProductVariantSchemaValues = z.infer<typeof deleteProductVariantSchema>;
