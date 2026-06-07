import { z } from "zod";

export const SEO_INDEXING_MODES = [
  "INDEX_FOLLOW",
  "INDEX_NOFOLLOW",
  "NOINDEX_FOLLOW",
  "NOINDEX_NOFOLLOW",
] as const;

export type SeoIndexingModeValue = (typeof SEO_INDEXING_MODES)[number];

export const seoSettingsSchema = z.object({
  metaTitle: z.string().max(120).optional().nullable(),
  metaDescription: z.string().max(320).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  openGraphTitle: z.string().max(120).optional().nullable(),
  openGraphDescription: z.string().max(320).optional().nullable(),
  twitterTitle: z.string().max(120).optional().nullable(),
  twitterDescription: z.string().max(320).optional().nullable(),
  indexingMode: z.enum(SEO_INDEXING_MODES),
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
