import { z } from "zod";

import { SEO_INDEXING_MODE_VALUES, type SeoIndexingMode } from "@/entities/seo";

export type SeoIndexingModeValue = SeoIndexingMode;

export const seoSettingsSchema = z.object({
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  openGraphTitle: z.string().max(120).optional().nullable(),
  openGraphDescription: z.string().max(320).optional().nullable(),
  twitterTitle: z.string().max(120).optional().nullable(),
  twitterDescription: z.string().max(320).optional().nullable(),
  indexingMode: z.enum([...SEO_INDEXING_MODE_VALUES]),
  sitemapIncluded: z
    .enum(["true", "false"])
    .transform((v) => v === "true"),
});

export type SeoSettingsInput = z.infer<typeof seoSettingsSchema>;

export type SeoSettingsFormState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof SeoSettingsInput, string>>;
    };
