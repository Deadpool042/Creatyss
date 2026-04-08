import { z } from "zod";

export const attachProductImagesSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetIds: z.array(z.string().trim().min(1)).min(1, "Sélectionne au moins une image."),
});

export type AttachProductImagesSchemaInput = z.input<typeof attachProductImagesSchema>;
export type AttachProductImagesSchemaValues = z.infer<typeof attachProductImagesSchema>;
