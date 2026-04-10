import { normalizeSeoText } from "@/entities/seo";
import type { ProductSeoEditorModel, ProductSeoSource } from "../types/product-seo.types";
import {
  buildProductSeoPublicPath,
  resolveProductSeoFallbackDescription,
  resolveProductSeoFallbackOpenGraphImageUrl,
  resolveProductSeoFallbackTitle,
} from "../helpers/product-seo-defaults";

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
