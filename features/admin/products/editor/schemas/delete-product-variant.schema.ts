import { z } from "zod";

export const deleteProductVariantSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  variantId: z.string().trim().min(1, "Variante requise."),
});

export type DeleteProductVariantSchemaInput = z.input<typeof deleteProductVariantSchema>;
export type DeleteProductVariantSchemaValues = z.infer<typeof deleteProductVariantSchema>;
