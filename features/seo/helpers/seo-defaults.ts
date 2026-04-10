import type { SeoInput } from "@/entities/seo";

export function createDefaultSeoInput(): SeoInput {
  return {
    metaTitle: "",
    metaDescription: "",
    indexingMode: "INDEX_FOLLOW",
    sitemapIncluded: true,
    canonicalPath: null,
    openGraphTitle: "",
    openGraphDescription: "",
    openGraphImageAssetId: null,
  };
}
