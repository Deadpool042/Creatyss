import Image from "next/image";
import Link from "next/link";
import { Archive } from "lucide-react";

import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
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
        <AdminFormSection eyebrow="Média sélectionné" title={asset.originalName}>
          <div className="flex justify-end">
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
        </AdminFormSection>

        <div className="grid gap-3 border-t border-surface-border/60 pt-5">
          <AdminFormSection
            title="Actions"
            description={
              <>
              Le recadrage remplace le fichier existant. L&apos;archivage retire le média de la
              bibliothèque active sans suppression définitive.
              </>
            }
          >

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
          </AdminFormSection>
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
    <div className="grid gap-1.5 rounded-2xl border border-surface-border/60 bg-surface-subtle/20 px-4 py-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className={mono ? "break-all font-mono text-xs text-foreground" : "text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
