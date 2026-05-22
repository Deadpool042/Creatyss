import { z } from "zod";

export const productImageAltTextSchema = z.object({
  productId: z.string().trim().min(1),
  imageId: z.string().trim().min(1),
  altText: z.string().default(""),
});

export const productImageReorderSchema = z.object({
  productId: z.string().trim().min(1),
  imageId: z.string().trim().min(1),
  sortOrder: z.number().int().min(0),
});

export const reorderProductImageSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
  direction: z.enum(["up", "down"]),
});

export const updateProductImageAltTextSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
  altText: z.string().max(255, "255 caractères maximum.").default(""),
});

export const setProductPrimaryImageSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
});

export const deleteProductImageSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
});

export type ProductImageAltTextSchema = z.infer<typeof productImageAltTextSchema>;
export type ProductImageReorderSchema = z.infer<typeof productImageReorderSchema>;
export type ReorderProductImageSchemaInput = z.input<typeof reorderProductImageSchema>;
export type ReorderProductImageSchemaValues = z.infer<typeof reorderProductImageSchema>;
export type UpdateProductImageAltTextSchemaInput = z.input<typeof updateProductImageAltTextSchema>;
export type UpdateProductImageAltTextSchemaValues = z.infer<typeof updateProductImageAltTextSchema>;
export type SetProductPrimaryImageSchemaInput = z.input<typeof setProductPrimaryImageSchema>;
export type SetProductPrimaryImageSchemaValues = z.infer<typeof setProductPrimaryImageSchema>;
export type DeleteProductImageSchemaInput = z.input<typeof deleteProductImageSchema>;
export type DeleteProductImageSchemaValues = z.infer<typeof deleteProductImageSchema>;
