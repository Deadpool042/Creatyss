import type { JSX } from "react";

type SeoSearchPreviewProps = {
  publicPath: string;
  title: string;
  description: string;
};

export function SeoSearchPreview({
  publicPath,
  title,
  description,
}: SeoSearchPreviewProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-surface-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Aperçu moteur de recherche
      </p>

      <div className="mt-3 space-y-1 rounded-xl border border-surface-border bg-surface-panel px-3 py-3">
        <p className="truncate text-xs text-muted-foreground">{publicPath}</p>
        <p className="line-clamp-2 text-base font-medium leading-6 text-brand">
          {title.length > 0 ? title : "Titre SEO"}
        </p>
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {description.length > 0 ? description : "Description SEO"}
        </p>
      </div>
    </div>
  );
}
