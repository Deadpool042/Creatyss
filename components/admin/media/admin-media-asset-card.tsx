import Image from "next/image";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminMediaAssetCardItem = {
  originalName: string;
  previewUrl: string | null;
  createdAtLabel: string;
  byteSizeLabel: string;
  dimensionsLabel: string;
  mimeType: string;
  filePath: string;
};

type AdminMediaAssetCardProps = {
  asset: AdminMediaAssetCardItem;
};

function InfoTile({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-surface-panel-soft p-4",
        className
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-sm leading-6 text-foreground", valueClassName)}>{value}</p>
    </div>
  );
}

export function AdminMediaAssetCard({ asset }: AdminMediaAssetCardProps) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-4xl border border-surface-border bg-card p-4 shadow-card transition-colors duration-200 hover:border-surface-border-strong">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-media-surface">
        {asset.previewUrl ? (
          <Image
            alt={asset.originalName}
            className="object-cover"
            fill
            loading="lazy"
            sizes="(min-width: 1280px) 22rem, (min-width: 768px) 18rem, 100vw"
            src={asset.previewUrl}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-media-surface px-4 text-center text-media-foreground">
            <ImageIcon className="h-8 w-8" />
            <p className="text-sm font-medium">Aperçu indisponible</p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {asset.previewUrl ? (
              <span className="inline-flex h-7 items-center rounded-full border border-surface-border-strong bg-interactive-selected px-3 text-xs font-medium text-foreground">
                Aperçu disponible
              </span>
            ) : (
              <span className="inline-flex h-7 items-center rounded-full border border-feedback-warning-border bg-feedback-warning-surface px-3 text-xs font-medium text-feedback-warning-foreground">
                Aperçu indisponible
              </span>
            )}

            <span className="inline-flex h-7 items-center rounded-full border border-surface-border bg-surface-panel-soft px-3 text-xs font-medium text-muted-foreground">
              {asset.byteSizeLabel}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
              {asset.originalName}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">{asset.mimeType}</p>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoTile label="Ajouté le" value={asset.createdAtLabel} />
            <InfoTile label="Dimensions" value={asset.dimensionsLabel} />
          </div>

          <InfoTile label="Chemin" value={asset.filePath} valueClassName="break-all" />
        </div>
      </div>
    </article>
  );
}
