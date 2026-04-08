import { z } from "zod";

export const uploadProductImagesSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  altText: z.string().max(255, "255 caractères maximum.").default(""),
  makePrimary: z.boolean().default(false),
});

export type UploadProductImagesSchemaInput = z.input<typeof uploadProductImagesSchema>;
export type UploadProductImagesSchemaValues = z.infer<typeof uploadProductImagesSchema>;
