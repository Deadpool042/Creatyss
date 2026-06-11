export type SeoIndexingMode =
  | "INDEX_FOLLOW"
  | "INDEX_NOFOLLOW"
  | "NOINDEX_FOLLOW"
  | "NOINDEX_NOFOLLOW";

export const SEO_INDEXING_MODE_VALUES = [
  "INDEX_FOLLOW",
  "INDEX_NOFOLLOW",
  "NOINDEX_FOLLOW",
  "NOINDEX_NOFOLLOW",
] as const satisfies readonly SeoIndexingMode[];

export const SEO_INDEXING_MODE_DEFAULT: SeoIndexingMode = "INDEX_FOLLOW";

export const SEO_INDEXING_MODE_LABELS: Record<SeoIndexingMode, string> = {
  INDEX_FOLLOW: "Index, follow",
  INDEX_NOFOLLOW: "Index, nofollow",
  NOINDEX_FOLLOW: "Noindex, follow",
  NOINDEX_NOFOLLOW: "Noindex, nofollow",
};

export function isSeoIndexingMode(value: string): value is SeoIndexingMode {
  return SEO_INDEXING_MODE_VALUES.includes(value as SeoIndexingMode);
}

export function getSeoRobotsFlags(
  mode: SeoIndexingMode | null | undefined
): { index: boolean; follow: boolean } | undefined {
  if (mode === null || mode === undefined) {
    return undefined;
  }

  switch (mode) {
    case "INDEX_FOLLOW":
      return { index: true, follow: true };
    case "INDEX_NOFOLLOW":
      return { index: true, follow: false };
    case "NOINDEX_FOLLOW":
      return { index: false, follow: true };
    case "NOINDEX_NOFOLLOW":
      return { index: false, follow: false };
  }
}
