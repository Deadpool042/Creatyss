//features/admin/products/editor/types/product-delete.types.ts
import { z } from "zod";

export const deleteProductSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
});

export type DeleteProductSchemaInput = z.input<typeof deleteProductSchema>;
export type DeleteProductSchemaValues = z.infer<typeof deleteProductSchema>;
