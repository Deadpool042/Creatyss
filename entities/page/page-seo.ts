import type { PageSeo } from "./page-types";

export function buildDefaultPageSeo(): PageSeo {
  return {
    metaTitle: null,
    metaDescription: null,
    canonicalUrl: null,
    noIndex: false,
  };
}
