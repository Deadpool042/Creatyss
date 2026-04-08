import { z } from "zod";

export const reorderProductImageSchema = z.object({
  productId: z.string().trim().min(1, "Produit requis."),
  assetId: z.string().trim().min(1, "Image requise."),
  direction: z.enum(["up", "down"]),
});

export type ReorderProductImageSchemaInput = z.input<typeof reorderProductImageSchema>;
export type ReorderProductImageSchemaValues = z.infer<typeof reorderProductImageSchema>;
