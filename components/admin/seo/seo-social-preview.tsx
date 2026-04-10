import Image from "next/image";
import type { JSX } from "react";
import { cn } from "@/lib/utils";

type SeoSocialPreviewProps = {
  title: string;
  description: string;
  imageUrl: string | null;
  siteLabel?: string;
  compact?: boolean;
};

export function SeoSocialPreview({
  title,
  description,
  imageUrl,
  siteLabel = "Aperçu Open Graph",
  compact = false,
}: SeoSocialPreviewProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-surface-border bg-card p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Aperçu partage social
      </p>

      <div className="mt-3 overflow-hidden rounded-xl border border-surface-border bg-surface-panel">
        <div
          className={cn(
            "relative w-full border-b border-surface-border bg-muted",
            compact ? "aspect-[1.91/0.78]" : "aspect-[1.91/0.86]"
          )}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1280px) 320px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              Aucune image Open Graph
            </div>
          )}
        </div>

        <div className={cn("space-y-1.5", compact ? "p-2.5" : "p-3")}>
          <p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            {siteLabel}
          </p>

          <p className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
            {title.length > 0 ? title : "Titre Open Graph"}
          </p>

          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {description.length > 0 ? description : "Description Open Graph"}
          </p>
        </div>
      </div>
    </div>
  );
}
