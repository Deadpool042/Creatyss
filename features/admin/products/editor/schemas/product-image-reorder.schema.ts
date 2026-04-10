import { z } from "zod";

export const productImageReorderSchema = z.object({
  productId: z.string().trim().min(1),
  imageId: z.string().trim().min(1),
  sortOrder: z.number().int().min(0),
});

export type ProductImageReorderSchema = z.infer<typeof productImageReorderSchema>;
