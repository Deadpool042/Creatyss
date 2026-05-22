import { normalizeSeoText, type SeoIndexingMode } from "@/entities/seo";
import type { SeoEditorModel } from "@/features/seo";

// ---------------------------------------------------------------------------
// Types (formerly types/product-seo.types.ts)
// ---------------------------------------------------------------------------

export type ProductSeoSource = {
  productId: string;
  productSlug: string;
  productName: string;
  productShortDescription: string | null;
  primaryImageUrl: string | null;
  seo: {
    metaTitle: string;
    metaDescription: string;
    indexingMode: SeoIndexingMode;
    sitemapIncluded: boolean;
    canonicalPath: string | null;
    openGraphTitle: string;
    openGraphDescription: string;
    openGraphImageAssetId: string | null;
  };
};

export type ProductSeoEditorModel = SeoEditorModel & {
  productId: string;
  productSlug: string;
};

// ---------------------------------------------------------------------------
// Helpers (formerly helpers/product-seo-defaults.ts)
// ---------------------------------------------------------------------------

export function buildProductSeoPublicPath(productSlug: string): string {
  return `/products/${productSlug}`;
}

export function resolveProductSeoFallbackTitle(productName: string): string {
  return normalizeSeoText(productName);
}

export function resolveProductSeoFallbackDescription(
  productShortDescription: string | null
): string {
  if (productShortDescription === null) {
    return "";
  }

  return normalizeSeoText(productShortDescription);
}

export function resolveProductSeoFallbackOpenGraphImageUrl(
  primaryImageUrl: string | null
): string | null {
  if (primaryImageUrl === null) {
    return null;
  }

  const normalized = primaryImageUrl.trim();
  return normalized.length > 0 ? normalized : null;
}

// ---------------------------------------------------------------------------
// Mapper (formerly mappers/product-seo.mappers.ts)
// ---------------------------------------------------------------------------

export function createProductSeoEditorModel(source: ProductSeoSource): ProductSeoEditorModel {
  const fallbackTitle = resolveProductSeoFallbackTitle(source.productName);
  const fallbackDescription = resolveProductSeoFallbackDescription(source.productShortDescription);
  const fallbackOpenGraphImageUrl = resolveProductSeoFallbackOpenGraphImageUrl(
    source.primaryImageUrl
  );

  const editableMetaTitle = normalizeSeoText(source.seo.metaTitle);
  const editableMetaDescription = normalizeSeoText(source.seo.metaDescription);
  const editableOpenGraphTitle = normalizeSeoText(source.seo.openGraphTitle);
  const editableOpenGraphDescription = normalizeSeoText(source.seo.openGraphDescription);

  return {
    productId: source.productId,
    productSlug: source.productSlug,
    editable: {
      metaTitle: editableMetaTitle,
      metaDescription: editableMetaDescription,
      indexingMode: source.seo.indexingMode,
      sitemapIncluded: source.seo.sitemapIncluded,
      canonicalPath: source.seo.canonicalPath,
      openGraphTitle: editableOpenGraphTitle,
      openGraphDescription: editableOpenGraphDescription,
      openGraphImageAssetId: source.seo.openGraphImageAssetId,
    },
    preview: {
      publicPath: buildProductSeoPublicPath(source.productSlug),
      resolvedTitle: editableMetaTitle.length > 0 ? editableMetaTitle : fallbackTitle,
      resolvedDescription:
        editableMetaDescription.length > 0 ? editableMetaDescription : fallbackDescription,
      resolvedOpenGraphImageUrl: fallbackOpenGraphImageUrl,
    },
  };
}
