import { SEO_INDEXING_MODE_DEFAULT, type SeoInput } from "@/entities/seo";

export function createDefaultSeoInput(): SeoInput {
  return {
    metaTitle: "",
    metaDescription: "",
    indexingMode: SEO_INDEXING_MODE_DEFAULT,
    sitemapIncluded: true,
    canonicalPath: null,
    openGraphTitle: "",
    openGraphDescription: "",
    openGraphImageAssetId: null,
  };
}
