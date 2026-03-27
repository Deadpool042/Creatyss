import { z } from "zod";

export const productListItemDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const productDetailsDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProductInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  slug: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
  storeId: z.string().min(1, "Store ID is required"),
});

export const updateProductInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  name: z.string().trim().min(1, "Name is required").max(255),
  slug: z.string().trim().min(1).max(255).optional(),
  description: z.string().trim().max(5000).nullable().optional(),
});

export type ProductListItemDTO = z.infer<typeof productListItemDTOSchema>;
export type ProductDetailsDTO = z.infer<typeof productDetailsDTOSchema>;
export type CreateProductInput = z.infer<typeof createProductInputSchema>;
export type UpdateProductInput = z.infer<typeof updateProductInputSchema>;
