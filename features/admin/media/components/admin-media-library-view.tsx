import Image from "next/image";
import Link from "next/link";

import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { Badge } from "@/components/ui/badge";
import type {
  AdminMediaFormatFilter,
  AdminMediaLibraryView,
  AdminMediaListItem,
  AdminMediaSortOption,
  AdminMediaUsageFilter,
  AdminMediaUsageSummary,
} from "@/features/admin/media/types/admin-media-list-item.types";
import type { AdminMediaStats } from "@/features/admin/settings/queries/get-media-stats.query";

import { AdminMediaLibraryAside } from "./admin-media-library-aside";
import {
  ADMIN_MEDIA_PAGE_SIZE,
  ADMIN_MEDIA_PER_PAGE_OPTIONS,
  buildMediaLibraryHref,
  DEFAULT_ADMIN_MEDIA_FORMAT,
  DEFAULT_ADMIN_MEDIA_SORT,
  DEFAULT_ADMIN_MEDIA_USAGE,
  DEFAULT_ADMIN_MEDIA_VIEW,
  formatByteSize,
  formatDimensions,
  formatMimeLabel,
  getMediaOrientationLabel,
  integerFormatter,
  type MediaLibrarySearchParams,
} from "./admin-media-library-helpers";
import { AdminMediaLibraryPaginationBar } from "./admin-media-library-pagination-bar";
import { AdminMediaLibraryToolbar } from "./admin-media-library-toolbar";
import { AdminMediaSelectedAside } from "./admin-media-selected-aside";
import { AdminMediaSelectedSheet } from "./admin-media-selected-sheet";

type AdminMediaLibraryViewProps = Readonly<{
  assets: AdminMediaListItem[];
  currentPage: number;
  error?: string;
  format: AdminMediaFormatFilter;
  mediaStats: AdminMediaStats;
  perPage: number;
  query: string;
  selectedMedia: AdminMediaListItem | null;
  selectedMediaUsage: AdminMediaUsageSummary | null;
  sort: AdminMediaSortOption;
  status?: string;
  totalCount: number;
  totalPages: number;
  usage: AdminMediaUsageFilter;
  view: AdminMediaLibraryView;
}>;

export function AdminMediaLibraryView({
  assets,
  currentPage,
  error,
  format,
  mediaStats,
  perPage,
  query,
  selectedMedia,
  selectedMediaUsage,
  sort,
  status,
  totalCount,
  totalPages,
  usage,
  view,
}: AdminMediaLibraryViewProps) {
  const rangeStart = assets.length > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const rangeEnd = assets.length > 0 ? rangeStart + assets.length - 1 : 0;
  const asideSearchState = {
    ...(format !== DEFAULT_ADMIN_MEDIA_FORMAT ? { format } : {}),
    ...(perPage !== ADMIN_MEDIA_PAGE_SIZE ? { perPage } : {}),
    ...(query ? { q: query } : {}),
    ...(sort !== DEFAULT_ADMIN_MEDIA_SORT ? { sort } : {}),
    ...(status ? { status } : {}),
    ...(usage !== DEFAULT_ADMIN_MEDIA_USAGE ? { usage } : {}),
    ...(view !== DEFAULT_ADMIN_MEDIA_VIEW ? { view } : {}),
  } satisfies Omit<MediaLibrarySearchParams, "assetId">;
  const closeSelectionHref = buildMediaLibraryHref({ page: currentPage, ...asideSearchState });
  const gridClassName = selectedMedia
    ? "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4"
    : "grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

  return (
    <div className="grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_24rem] xl:items-start">
      <section className="grid min-w-0 gap-4">
        <AdminMediaLibraryToolbar
          format={format}
          query={query}
          sort={sort}
          totalCount={totalCount}
          usage={usage}
          view={view}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border/40 pb-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {view === "trash" ? "Corbeille médias" : "Images actives"}
            </Badge>
            {assets.length > 0 ? (
              <Badge variant="outline">
                {integerFormatter.format(rangeStart)}-{integerFormatter.format(rangeEnd)}
              </Badge>
            ) : null}
            <Badge variant="outline">Page {currentPage}</Badge>
          </div>
        </div>

        {assets.length > 0 ? (
          <>
            <div className={gridClassName}>
              {assets.map((asset) => (
                <MediaGridItem
                  key={asset.id}
                  asset={asset}
                  currentPage={currentPage}
                  isSelected={selectedMedia?.id === asset.id}
                  searchState={{ ...(error ? { error } : {}), ...asideSearchState }}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <AdminMediaLibraryPaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                perPage={perPage}
                totalItems={totalCount}
                perPageOptions={ADMIN_MEDIA_PER_PAGE_OPTIONS}
              />
            ) : null}
          </>
        ) : (
            <AdminEmptyState
              description={
                view === "trash"
                  ? "Les médias archivés apparaîtront ici avant suppression définitive."
                  : "Importez une première image pour commencer votre bibliothèque."
              }
              eyebrow={view === "trash" ? "Corbeille vide" : "Aucun média"}
              title={
                view === "trash"
                  ? "Aucun média archivé"
                  : "La bibliothèque est encore vide"
              }
            />
          )}
      </section>

      {selectedMedia ? (
        <AdminMediaSelectedSheet
          closeHref={closeSelectionHref}
          title={selectedMedia.title?.trim().length ? selectedMedia.title : selectedMedia.originalName}
          description="Inspecte le média, mets à jour ses métadonnées SEO et pilote son cycle de vie sans quitter la grille."
        >
          <AdminMediaSelectedAside
            asset={selectedMedia}
            currentPage={currentPage}
            searchState={asideSearchState}
            usageSummary={selectedMediaUsage}
            view={view}
          />
        </AdminMediaSelectedSheet>
      ) : null}

      <aside className="hidden min-w-0 xl:sticky xl:top-6 xl:block">
        {selectedMedia ? (
          <AdminMediaSelectedAside
            asset={selectedMedia}
            currentPage={currentPage}
            searchState={asideSearchState}
            usageSummary={selectedMediaUsage}
            view={view}
          />
        ) : (
          <AdminMediaLibraryAside
            activeAssetCount={mediaStats.activeAssetCount}
            currentPage={currentPage}
            latestImageCreatedAt={mediaStats.latestImageCreatedAt}
            searchState={asideSearchState}
            totalCount={totalCount}
            totalImageBytes={mediaStats.totalImageBytes}
            view={view}
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
  searchState: MediaLibrarySearchParams;
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
        <div className="grid gap-2 border-t border-surface-border/40 px-3 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{asset.originalName}</p>
            <p className="text-xs text-muted-foreground">{formatByteSize(asset.byteSize)}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px]">
              {formatMimeLabel(asset.mimeType)}
            </Badge>
            <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px]">
              {formatDimensions(asset)}
            </Badge>
            <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px]">
              {getMediaOrientationLabel(asset)}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
