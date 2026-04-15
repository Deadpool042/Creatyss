import { z } from "zod";

export const deleteProductPermanentlySchema = z.object({
  productSlug: z.string().trim().min(1, "Le slug produit est requis."),
});

export type DeleteProductPermanentlySchema = z.infer<typeof deleteProductPermanentlySchema>;
