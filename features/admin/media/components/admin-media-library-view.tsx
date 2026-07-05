import Image from "next/image";
import Link from "next/link";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import type { AdminMediaListItem } from "@/features/admin/media/types/admin-media-list-item.types";
import type { AdminMediaStats } from "@/features/admin/settings/queries/get-media-stats.query";

import { AdminMediaLibraryAside } from "./admin-media-library-aside";
import {
  buildMediaLibraryHref,
  integerFormatter,
  type MediaLibrarySearchParams,
} from "./admin-media-library-helpers";
import { AdminMediaLibraryPagination } from "./admin-media-library-pagination";
import { AdminMediaSelectedAside } from "./admin-media-selected-aside";

type AdminMediaLibraryViewProps = Readonly<{
  assets: AdminMediaListItem[];
  currentPage: number;
  error?: string;
  mediaStats: AdminMediaStats;
  selectedMedia: AdminMediaListItem | null;
  status?: string;
  totalCount: number;
  totalPages: number;
}>;

export function AdminMediaLibraryView({
  assets,
  currentPage,
  error,
  mediaStats,
  selectedMedia,
  status,
  totalCount,
  totalPages,
}: AdminMediaLibraryViewProps) {
  const rangeStart = assets.length > 0 ? (currentPage - 1) * 24 + 1 : 0;
  const rangeEnd = assets.length > 0 ? rangeStart + assets.length - 1 : 0;

  return (
    <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
      <section className="grid min-w-0 gap-4">
        <div className="rounded-2xl border border-surface-border/60 bg-card px-5 py-5 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="grid gap-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80">
                Bibliothèque
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Images locales
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                La grille se concentre sur les visuels. Sélectionnez une image pour afficher ses
                informations et ses actions dans le panneau latéral.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex h-8 items-center rounded-full border border-surface-border bg-surface-panel-soft px-3 font-medium text-foreground">
                {integerFormatter.format(totalCount)} image{totalCount > 1 ? "s" : ""}
              </span>
              {assets.length > 0 ? (
                <span className="inline-flex h-8 items-center rounded-full border border-surface-border bg-surface-panel-soft px-3">
                  {integerFormatter.format(rangeStart)}-{integerFormatter.format(rangeEnd)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {assets.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
              {assets.map((asset) => (
                <MediaGridItem
                  key={asset.id}
                  asset={asset}
                  currentPage={currentPage}
                  isSelected={selectedMedia?.id === asset.id}
                  searchState={{
                    ...(error ? { error } : {}),
                    ...(status ? { status } : {}),
                  }}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <AdminMediaLibraryPagination
                currentPage={currentPage}
                totalPages={totalPages}
                {...(selectedMedia?.id ? { selectedAssetId: selectedMedia.id } : {})}
                {...(status ? { status } : {})}
                {...(error ? { error } : {})}
              />
            ) : null}
          </>
        ) : (
          <AdminEmptyState
            description="Importez une première image pour commencer votre bibliothèque."
            eyebrow="Aucun média"
            title="La bibliothèque est encore vide"
          />
        )}
      </section>

      <aside className="min-w-0 xl:sticky xl:top-6">
        {selectedMedia ? (
          <AdminMediaSelectedAside asset={selectedMedia} currentPage={currentPage} />
        ) : (
          <AdminMediaLibraryAside
            activeAssetCount={mediaStats.activeAssetCount}
            currentPage={currentPage}
            latestImageCreatedAt={mediaStats.latestImageCreatedAt}
            totalCount={totalCount}
            totalImageBytes={mediaStats.totalImageBytes}
          />
        )}
      </aside>
    </div>
  );
}

type MediaGridItemProps = Readonly<{
  asset: AdminMediaListItem;
  currentPage: number;
  isSelected: boolean;
  searchState: Pick<MediaLibrarySearchParams, "error" | "status">;
}>;

function MediaGridItem({ asset, currentPage, isSelected, searchState }: MediaGridItemProps) {
  return (
    <Link
      href={buildMediaLibraryHref({
        assetId: asset.id,
        page: currentPage,
        ...searchState,
      })}
      aria-label={`Afficher ${asset.originalName}`}
      className="block"
    >
      <div
        className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-surface-border-strong hover:shadow-card ${
          isSelected ? "border-primary/70 ring-2 ring-primary/25" : "border-surface-border/60"
        }`}
      >
        <div className="relative aspect-square bg-surface-panel/40">
          {asset.previewUrl ? (
            <Image
              src={asset.previewUrl}
              alt={asset.originalName}
              fill
              sizes="(min-width: 1536px) 16vw, (min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 50vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Aperçu indisponible
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
