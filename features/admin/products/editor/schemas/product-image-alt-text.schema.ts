import { z } from "zod";

export const productImageAltTextSchema = z.object({
  productId: z.string().trim().min(1),
  imageId: z.string().trim().min(1),
  altText: z.string().default(""),
});

export type ProductImageAltTextSchema = z.infer<typeof productImageAltTextSchema>;
