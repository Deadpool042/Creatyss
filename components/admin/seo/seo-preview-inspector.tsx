import type { JSX } from "react";

import type { SeoIndexingMode } from "@/entities/seo";

import { SeoSearchPreview } from "./seo-search-preview";
import { SeoSocialPreview } from "./seo-social-preview";

const INDEXING_MODE_LABELS: Record<SeoIndexingMode, string> = {
  INDEX_FOLLOW: "Index, follow",
  INDEX_NOFOLLOW: "Index, nofollow",
  NOINDEX_FOLLOW: "Noindex, follow",
  NOINDEX_NOFOLLOW: "Noindex, nofollow",
};

type SeoPreviewInspectorProps = {
  publicPath: string;
  title: string;
  description: string;
  openGraphTitle: string;
  openGraphDescription: string;
  openGraphImageUrl: string | null;
  indexingMode: SeoIndexingMode;
  sitemapIncluded: boolean;
};

export function SeoPreviewInspector({
  publicPath,
  title,
  description,
  openGraphTitle,
  openGraphDescription,
  openGraphImageUrl,
  indexingMode,
  sitemapIncluded,
}: SeoPreviewInspectorProps): JSX.Element {
  return (
    <aside aria-labelledby="seo-preview-inspector-title" className="self-start">
      <div className="overflow-hidden rounded-2xl border border-surface-border bg-card shadow-card">
        <div className="border-b border-surface-border px-4 py-3.5">
          <h3
            id="seo-preview-inspector-title"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
          >
            Inspecteur SEO
          </h3>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Aperçu public et état technique, en lecture seule.
          </p>
        </div>

        <div className="px-4 pb-4 pt-3">
          <div className="space-y-3">
            <SeoSearchPreview publicPath={publicPath} title={title} description={description} />

            <SeoSocialPreview
              title={openGraphTitle}
              description={openGraphDescription}
              imageUrl={openGraphImageUrl}
            />

            <div className="rounded-xl border border-surface-border bg-surface-panel p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                État technique
              </p>

              <dl className="mt-3 space-y-2.5">
                <div className="flex items-start justify-between gap-3 rounded-lg border border-surface-border bg-card px-3 py-2">
                  <dt className="shrink-0 text-xs text-muted-foreground">Indexation</dt>
                  <dd className="text-right text-xs font-medium text-foreground">
                    {INDEXING_MODE_LABELS[indexingMode]}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-3 rounded-lg border border-surface-border bg-card px-3 py-2">
                  <dt className="shrink-0 text-xs text-muted-foreground">Sitemap</dt>
                  <dd className="text-xs font-medium text-foreground">
                    {sitemapIncluded ? "Inclus" : "Exclu"}
                  </dd>
                </div>

                <div className="flex items-start justify-between gap-3 rounded-lg border border-surface-border bg-card px-3 py-2">
                  <dt className="shrink-0 text-xs text-muted-foreground">Canonique</dt>
                  <dd className="break-all text-right font-mono text-xs text-foreground">
                    {publicPath}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
