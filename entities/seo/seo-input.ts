export type SeoIndexingMode =
  | "INDEX_FOLLOW"
  | "INDEX_NOFOLLOW"
  | "NOINDEX_FOLLOW"
  | "NOINDEX_NOFOLLOW";

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
