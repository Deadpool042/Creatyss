import { z } from "zod";

const seoIndexingModeSchema = z.enum([
  "INDEX_FOLLOW",
  "INDEX_NOFOLLOW",
  "NOINDEX_FOLLOW",
  "NOINDEX_NOFOLLOW",
]);

export const updateProductSeoSchema = z.object({
  id: z.string().trim().min(1, "Identifiant produit requis."),
  seoTitle: z.string().trim().max(255, "Le titre SEO est trop long."),
  seoDescription: z.string().trim().max(320, "La description SEO est trop longue."),
  seoIndexingMode: seoIndexingModeSchema,
  seoSitemapIncluded: z.boolean(),
  seoCanonicalPath: z
    .string()
    .trim()
    .max(255, "Le chemin canonique est trop long.")
    .nullable()
    .refine((value) => value === null || value.startsWith("/"), {
      message: "Le chemin canonique doit commencer par '/'.",
    }),
  seoOpenGraphTitle: z.string().trim().max(255, "Le titre Open Graph est trop long."),
  seoOpenGraphDescription: z.string().trim().max(320, "La description Open Graph est trop longue."),
  seoOpenGraphImageId: z.string().trim().min(1).nullable(),
});
