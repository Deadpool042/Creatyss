import { z } from "zod";

export const productVariantFormSchema = z.object({
  variantId: z.string().optional().default(""),
  productId: z.string().trim().min(1),
  name: z.string().optional().default(""),
  slug: z.string().optional().default(""),
  sku: z.string().trim().min(1),
  status: z.enum(["draft", "active", "inactive", "archived"]),
  isDefault: z.enum(["true", "false"]).default("false"),
  sortOrder: z.string().trim().min(1),
  primaryImageId: z.string().optional().default(""),
  barcode: z.string().optional().default(""),
  externalReference: z.string().optional().default(""),
  weightGrams: z.string().optional().default(""),
  widthMm: z.string().optional().default(""),
  heightMm: z.string().optional().default(""),
  depthMm: z.string().optional().default(""),
});

export type ProductVariantFormSchema = z.infer<typeof productVariantFormSchema>;
