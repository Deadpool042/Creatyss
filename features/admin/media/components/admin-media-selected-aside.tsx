import Image from "next/image";
import Link from "next/link";
import { Archive, RotateCcw, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import type {
  AdminMediaLibraryView,
  AdminMediaListItem,
  AdminMediaUsageSummary,
} from "@/features/admin/media/types/admin-media-list-item.types";

import {
  archiveMediaAction,
  deleteMediaPermanentlyAction,
  restoreMediaAction,
} from "./admin-media-library-actions";
import {
  buildMediaLibraryHref,
  formatByteSize,
  formatDimensions,
  formatMimeLabel,
  getMediaOrientationLabel,
  mediaDateFormatter,
  type MediaLibrarySearchParams,
} from "./admin-media-library-helpers";
import { AdminMediaMetadataForm } from "./admin-media-metadata-form";
import { MediaCropButton } from "./media-crop-button";

type AdminMediaSelectedAsideProps = Readonly<{
  asset: AdminMediaListItem;
  currentPage: number;
  searchState?: Omit<MediaLibrarySearchParams, "assetId">;
  usageSummary: AdminMediaUsageSummary | null;
  view: AdminMediaLibraryView;
}>;

export function AdminMediaSelectedAside({
  asset,
  currentPage,
  searchState,
  usageSummary,
  view,
}: AdminMediaSelectedAsideProps) {
  return (
    <div className="grid gap-3">
      <div className="rounded-2xl border border-surface-border/60 bg-card p-4 shadow-card">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="relative mx-auto size-24 shrink-0 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/40 sm:mx-0">
            {asset.previewUrl ? (
              <Image
                src={asset.previewUrl}
                alt={asset.originalName}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
                Aperçu indisponible
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Média sélectionné
                </p>
                <h3 className="mt-1 break-words text-base font-semibold leading-tight text-foreground sm:truncate">
                  {asset.title?.trim().length ? asset.title : asset.originalName}
                </h3>
                <p className="mt-0.5 break-all text-xs text-muted-foreground sm:truncate">
                  {asset.originalName}
                </p>
              </div>

              <Button asChild variant="ghost" size="sm" className="shrink-0 rounded-full">
                <Link href={buildMediaLibraryHref({ page: currentPage, ...searchState })}>Fermer</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <MetaPill>{formatMimeLabel(asset.mimeType)}</MetaPill>
              <MetaPill>{formatDimensions(asset)}</MetaPill>
              <MetaPill>{getMediaOrientationLabel(asset)}</MetaPill>
              <MetaPill>{formatByteSize(asset.byteSize)}</MetaPill>
            </div>

            <dl className="grid gap-2 text-sm">
              <CompactRow label="Ajout" value={mediaDateFormatter.format(new Date(asset.createdAt))} />
              <CompactRow
                label="Alt"
                value={asset.altText?.trim().length ? asset.altText : "Non renseigné"}
              />
              <CompactRow label="Chemin" value={asset.filePath} mono />
            </dl>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-border/60 bg-card p-4 shadow-card">
        <AdminMediaMetadataForm asset={asset} />
      </div>

      {usageSummary ? (
        <div className="rounded-2xl border border-surface-border/60 bg-card p-4 shadow-card">
          <AdminFormSection
            eyebrow="Usages"
            title="Où ce média est utilisé"
            description="Compteurs actifs observés dans le catalogue, le contenu et l'identité de la boutique."
            className="space-y-2"
          >
            <div className="grid gap-2">
              <UsageRow label="Produits" value={usageSummary.productsCount} />
              <UsageRow label="Catégories" value={usageSummary.categoriesCount} />
              <UsageRow label="Contenus" value={usageSummary.contentCount} />
              <UsageRow label="SEO social" value={usageSummary.seoCount} />
              <UsageRow label="Branding" value={usageSummary.brandingCount} />
            </div>
          </AdminFormSection>
        </div>
      ) : null}

      <div className="rounded-2xl border border-surface-border/60 bg-card p-4 shadow-card">
        <AdminFormSection
          title="Actions"
          description={
            view === "trash"
              ? "Restaure le média dans la bibliothèque active ou supprime-le définitivement."
              : "Le recadrage remplace le fichier existant. L'archivage retire le média de la bibliothèque active sans suppression définitive."
          }
          className="space-y-2"
        >
          {view === "active" && asset.previewUrl ? (
            <div className="grid">
              <MediaCropButton
                assetId={asset.id}
                imageUrl={asset.previewUrl}
                imageLabel={asset.originalName}
              />
            </div>
          ) : null}

          {view === "trash" ? (
            <>
              <form action={restoreMediaAction} className="grid gap-3">
                <ActionHiddenFields
                  assetId={asset.id}
                  currentPage={currentPage}
                  {...(searchState ? { searchState } : {})}
                />
                <Button type="submit" variant="outline" className="w-full">
                  <RotateCcw className="size-4" />
                  Restaurer le média
                </Button>
              </form>

              <form action={deleteMediaPermanentlyAction} className="grid gap-3">
                <ActionHiddenFields
                  assetId={asset.id}
                  currentPage={currentPage}
                  {...(searchState ? { searchState } : {})}
                />
                <Button type="submit" variant="destructive" className="w-full">
                  <Trash2 className="size-4" />
                  Supprimer définitivement
                </Button>
              </form>
            </>
          ) : (
            <form action={archiveMediaAction} className="grid">
              <ActionHiddenFields
                assetId={asset.id}
                currentPage={currentPage}
                {...(searchState ? { searchState } : {})}
              />
              <Button type="submit" variant="destructive" className="w-full">
                <Archive className="size-4" />
                Archiver le média
              </Button>
            </form>
          )}
        </AdminFormSection>
      </div>
    </div>
  );
}

function ActionHiddenFields({
  assetId,
  currentPage,
  searchState,
}: Readonly<{
  assetId: string;
  currentPage: number;
  searchState?: Omit<MediaLibrarySearchParams, "assetId">;
}>) {
  return (
    <>
      <input type="hidden" name="assetId" value={assetId} />
      <input type="hidden" name="page" value={String(currentPage)} />
      {searchState?.perPage ? (
        <input type="hidden" name="perPage" value={String(searchState.perPage)} />
      ) : null}
      {searchState?.q ? <input type="hidden" name="q" value={searchState.q} /> : null}
      {searchState?.sort ? <input type="hidden" name="sort" value={searchState.sort} /> : null}
      {searchState?.format ? (
        <input type="hidden" name="format" value={searchState.format} />
      ) : null}
      {searchState?.usage ? <input type="hidden" name="usage" value={searchState.usage} /> : null}
      {searchState?.view ? <input type="hidden" name="view" value={searchState.view} /> : null}
    </>
  );
}

function UsageRow({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function MetaPill({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <span className="inline-flex items-center rounded-full border border-surface-border/60 bg-surface-subtle/20 px-2.5 py-1 text-[11px] text-foreground/80">
      {children}
    </span>
  );
}

function CompactRow({
  label,
  value,
  mono = false,
}: Readonly<{
  label: string;
  value: string;
  mono?: boolean;
}>) {
  return (
    <div className="grid gap-1 rounded-xl border border-surface-border/60 bg-surface-subtle/20 px-3 py-2.5">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className={mono ? "break-all font-mono text-xs text-foreground" : "text-sm text-foreground"}>
        {value}
      </dd>
    </div>
  );
}
