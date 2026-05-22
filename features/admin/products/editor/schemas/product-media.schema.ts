import { z } from "zod";

export const attachProductImagesSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetIds: z.array(z.string().trim().min(1)).min(1, "Sélectionne au moins une image."),
});

export const uploadProductImagesSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  altText: z.string().max(255, "255 caractères maximum.").default(""),
  makePrimary: z.boolean().default(false),
});

export type AttachProductImagesSchemaInput = z.input<typeof attachProductImagesSchema>;
export type AttachProductImagesSchemaValues = z.infer<typeof attachProductImagesSchema>;
export type UploadProductImagesSchemaInput = z.input<typeof uploadProductImagesSchema>;
export type UploadProductImagesSchemaValues = z.infer<typeof uploadProductImagesSchema>;
