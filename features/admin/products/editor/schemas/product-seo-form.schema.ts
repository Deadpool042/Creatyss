import { z } from "zod";

export const productSeoFormSchema = z.object({
  productId: z.string().trim().min(1),
  title: z.string().default(""),
  description: z.string().default(""),
  canonicalPath: z.string().default(""),
  indexingMode: z.enum([
    "INDEX_FOLLOW",
    "INDEX_NOFOLLOW",
    "NOINDEX_FOLLOW",
    "NOINDEX_NOFOLLOW",
  ]),
  sitemapIncluded: z.enum(["true", "false"]).default("true"),
  openGraphTitle: z.string().default(""),
  openGraphDescription: z.string().default(""),
  openGraphImageId: z.string().default(""),
  twitterTitle: z.string().default(""),
  twitterDescription: z.string().default(""),
  twitterImageId: z.string().default(""),
});

export type ProductSeoFormSchema = z.infer<typeof productSeoFormSchema>;
