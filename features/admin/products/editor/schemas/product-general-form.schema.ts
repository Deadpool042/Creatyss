//features/admin/products/editor/schemas/product-general-form.schema.ts
import { z } from "zod";

export const productGeneralFormSchema = z.object({
  productId: z.string().trim().min(1),
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  skuRoot: z.string().trim().optional().default(""),
  shortDescription: z.string().optional().default(""),
  description: z.string().optional().default(""),
  status: z.enum(["draft", "active", "inactive", "archived"]),
  isFeatured: z.enum(["true", "false"]).default("false"),
  productTypeId: z.string().optional().default(""),
  primaryImageId: z.string().optional().default(""),
});

export type ProductGeneralFormSchema = z.infer<typeof productGeneralFormSchema>;
