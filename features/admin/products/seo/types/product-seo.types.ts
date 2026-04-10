import type { SeoIndexingMode } from "@/entities/seo";
import type { SeoEditorModel } from "@/features/seo";

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
