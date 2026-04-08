//features/admin/products/navigation/schemas/products-page-params.schema.ts
import { z } from "zod";

export const productsPageStatusSchema = z.enum(["", "published", "draft", "archived"]);

export const productsPageFeaturedSchema = z.enum(["", "featured", "standard"]);

export const productsPageSearchParamsSchema = z.object({
  q: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  status: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .pipe(productsPageStatusSchema),
  category: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ""),
  featured: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .pipe(productsPageFeaturedSchema),
});
