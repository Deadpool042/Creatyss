import { z } from "zod";

const emptyToNull = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v));

export const productSeoFormSchema = z.object({
  productId: z.string().trim().min(1),
  title: z.string().trim().max(255, "Le titre SEO est trop long (max 255 car.).").default(""),
  description: z
    .string()
    .trim()
    .max(320, "La description SEO est trop longue (max 320 car.).")
    .default(""),
  canonicalPath: emptyToNull.refine((v) => v === null || v.startsWith("/"), {
    message: "Le chemin canonique doit commencer par '/'.",
  }),
  indexingMode: z.enum(["INDEX_FOLLOW", "INDEX_NOFOLLOW", "NOINDEX_FOLLOW", "NOINDEX_NOFOLLOW"]),
  sitemapIncluded: z.enum(["true", "false"]).default("true"),
  openGraphTitle: z
    .string()
    .trim()
    .max(255, "Le titre Open Graph est trop long (max 255 car.).")
    .default(""),
  openGraphDescription: z
    .string()
    .trim()
    .max(320, "La description Open Graph est trop longue (max 320 car.).")
    .default(""),
  openGraphImageId: emptyToNull,
  twitterTitle: z
    .string()
    .trim()
    .max(255, "Le titre réseau social est trop long (max 255 car.).")
    .default(""),
  twitterDescription: z
    .string()
    .trim()
    .max(320, "La description réseau social est trop longue (max 320 car.).")
    .default(""),
  twitterImageId: emptyToNull,
});

export type ProductSeoFormSchema = z.infer<typeof productSeoFormSchema>;
