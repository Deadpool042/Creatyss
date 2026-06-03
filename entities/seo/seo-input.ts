import type { SeoIndexingMode } from "./seo-indexing-mode";

export type SeoInput = {
  metaTitle: string;
  metaDescription: string;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
  canonicalPath: string | null;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageAssetId: string | null;
};
