import Image from "next/image";
import Link from "next/link";
import { Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";

import { archiveMediaAction } from "./admin-media-library-actions";
import {
  buildMediaLibraryHref,
  formatByteSize,
  formatDimensions,
  mediaDateFormatter,
} from "./admin-media-library-helpers";
import { MediaCropButton } from "./media-crop-button";

type AdminMediaSelectedAsideProps = Readonly<{
  asset: AdminMediaListItem;
  currentPage: number;
}>;

export function AdminMediaSelectedAside({
  asset,
  currentPage,
}: AdminMediaSelectedAsideProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-border/60 bg-card shadow-card">
      <div className="relative aspect-[4/5] bg-surface-panel/40">
        {asset.previewUrl ? (
          <Image
            src={asset.previewUrl}
            alt={asset.originalName}
            fill
            sizes="(min-width: 1280px) 24rem, 100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Aperçu indisponible
          </div>
        )}
      </div>

      <div className="grid gap-5 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Média sélectionné
            </p>
            <h3 className="break-words text-lg font-semibold tracking-tight text-foreground">
              {asset.originalName}
            </h3>
          </div>

          <Button asChild variant="ghost" size="sm">
            <Link href={buildMediaLibraryHref({ page: currentPage })}>Fermer</Link>
          </Button>
        </div>

        <dl className="grid gap-3 text-sm">
          <InfoRow label="Format" value={asset.mimeType} />
          <InfoRow label="Dimensions" value={formatDimensions(asset)} />
          <InfoRow label="Poids" value={formatByteSize(asset.byteSize)} />
          <InfoRow label="Ajout" value={mediaDateFormatter.format(new Date(asset.createdAt))} />
          <InfoRow label="Chemin" value={asset.filePath} mono />
        </dl>

        <div className="grid gap-3 border-t border-surface-border/60 pt-5">
          <div className="grid gap-1.5">
            <p className="text-sm font-medium text-foreground">Actions</p>
            <p className="text-sm leading-6 text-muted-foreground">
              Le recadrage remplace le fichier existant. L&apos;archivage retire le média de la
              bibliothèque active sans suppression définitive.
            </p>
          </div>

          {asset.previewUrl ? (
            <div>
              <MediaCropButton
                assetId={asset.id}
                imageUrl={asset.previewUrl}
                imageLabel={asset.originalName}
              />
            </div>
          ) : null}

          <form action={archiveMediaAction} className="grid">
            <input type="hidden" name="assetId" value={asset.id} />
            <input type="hidden" name="page" value={String(currentPage)} />
            <Button type="submit" variant="destructive" className="w-full">
              <Archive className="size-4" />
              Archiver le média
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: Readonly<{
  label: string;
  value: string;
  mono?: boolean;
}>) {
  return (
    <div className="grid gap-1.5 rounded-2xl border border-surface-border/60 bg-surface-panel/25 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className={mono ? "break-all font-mono text-xs text-foreground" : "text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
