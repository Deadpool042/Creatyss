import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Archive, HardDrive, Image as ImageIcon, Library, Upload } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ACCEPTED_IMAGE_MIME_TYPES, MAX_IMAGE_FILE_SIZE_BYTES } from "@/core/uploads";
import {
  getAdminMediaAssetById,
  listAdminMediaAssets,
  MediaUploadError,
  uploadAdminMedia,
  type AdminMediaListItem,
} from "@/features/admin/media";
import { MediaCropButton } from "@/features/admin/media/components/media-crop-button";
import { MediaRouteNav } from "@/features/admin/media/components/media-route-nav";
import { archiveAdminMedia } from "@/features/admin/media/services/archive-admin-media.service";
import { ADMIN_CATALOG_MEDIA_PATH } from "@/features/admin/catalog/shared/admin-catalog-routes";
import { getAdminMediaStats } from "@/features/admin/settings/queries/get-media-stats.query";

export const dynamic = "force-dynamic";

const ADMIN_MEDIA_PAGE_SIZE = 24;

const mediaDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

const integerFormatter = new Intl.NumberFormat("fr-FR");

const acceptedFormatsLabel = [...ACCEPTED_IMAGE_MIME_TYPES]
  .map((mime) => mime.replace("image/", "").toUpperCase())
  .join(", ");

const maxFileSizeMb = MAX_IMAGE_FILE_SIZE_BYTES / (1024 * 1024);

type MediaPageProps = Readonly<{
  searchParams: Promise<{
    assetId?: string | string[];
    error?: string | string[];
    page?: string | string[];
    status?: string | string[];
  }>;
}>;

type MediaHrefOptions = {
  assetId?: string;
  error?: string;
  page?: number;
  status?: string;
};

function getSingleSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: FormDataEntryValue | string | null | undefined): number {
  const rawValue = typeof value === "string" ? value : null;
  const parsed = rawValue ? Number.parseInt(rawValue, 10) : Number.NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function buildMediaLibraryHref({ assetId, error, page, status }: MediaHrefOptions): string {
  const params = new URLSearchParams();

  if (assetId) {
    params.set("assetId", assetId);
  }

  if (error) {
    params.set("error", error);
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  if (status) {
    params.set("status", status);
  }

  const query = params.toString();

  return query.length > 0 ? `${ADMIN_CATALOG_MEDIA_PATH}?${query}` : ADMIN_CATALOG_MEDIA_PATH;
}

function formatByteSize(byteSize: number | null): string {
  if (byteSize === null || !Number.isFinite(byteSize) || byteSize <= 0) {
    return "Indisponible";
  }

  if (byteSize >= 1024 * 1024 * 1024) {
    return `${(byteSize / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  if (byteSize >= 1024 * 1024) {
    return `${(byteSize / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (byteSize >= 1024) {
    return `${Math.round(byteSize / 1024)} KB`;
  }

  return `${byteSize} o`;
}

function formatDimensions(asset: Pick<AdminMediaListItem, "imageWidth" | "imageHeight">): string {
  return asset.imageWidth !== null && asset.imageHeight !== null
    ? `${asset.imageWidth} × ${asset.imageHeight}`
    : "Indisponibles";
}

function getErrorMessage(errorCode: string | undefined): string | null {
  switch (errorCode) {
    case "missing_file":
      return "Sélectionnez une image à importer.";
    case "empty_file":
      return "Le fichier sélectionné est vide.";
    case "file_too_large":
      return "Le fichier dépasse la limite de 10 MB.";
    case "unsupported_file":
      return "Seules les images JPEG, PNG, WebP et AVIF sont acceptées.";
    case "write_failed":
      return "Le fichier n'a pas pu être enregistré localement.";
    case "database_insert_failed":
      return "Le fichier a été refusé lors de l'enregistrement en base.";
    case "upload_failed":
      return "L'import du média a échoué.";
    default:
      return null;
  }
}

function getPaginationItems(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    items.push("ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push("ellipsis");
  }

  items.push(totalPages);

  return items;
}

async function archiveMediaAction(formData: FormData) {
  "use server";

  await requireAuthenticatedAdmin();

  const assetId = formData.get("assetId");
  const page = parsePositiveInt(formData.get("page"));

  if (typeof assetId === "string" && assetId.trim().length > 0) {
    await archiveAdminMedia({ assetId: assetId.trim() });
  }

  redirect(
    buildMediaLibraryHref({
      page,
      status: "archived",
    })
  );
}

async function uploadMediaAction(formData: FormData) {
  "use server";

  await requireAuthenticatedAdmin();

  try {
    const asset = await uploadAdminMedia({
      file: formData.get("file"),
    });

    redirect(
      buildMediaLibraryHref({
        assetId: asset.id,
        status: "uploaded",
      })
    );
  } catch (error) {
    const errorCode = error instanceof MediaUploadError ? error.code : "upload_failed";

    redirect(
      buildMediaLibraryHref({
        error: errorCode,
      })
    );
  }
}

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = getSingleSearchParam(resolvedSearchParams.status);
  const errorParam = getSingleSearchParam(resolvedSearchParams.error);
  const assetIdParam = getSingleSearchParam(resolvedSearchParams.assetId)?.trim() || undefined;
  const requestedPage = parsePositiveInt(getSingleSearchParam(resolvedSearchParams.page));

  const successMessage =
    statusParam === "uploaded"
      ? "Média importé avec succès."
      : statusParam === "archived"
        ? "Média archivé. Il n'apparaît plus dans la bibliothèque."
        : null;

  const errorMessage = getErrorMessage(errorParam);

  const [assetsPage, mediaStats, selectedAsset] = await Promise.all([
    listAdminMediaAssets({
      page: requestedPage,
      pageSize: ADMIN_MEDIA_PAGE_SIZE,
    }),
    getAdminMediaStats().catch(() => ({
      activeAssetCount: 0,
      totalImageBytes: 0,
      latestImageCreatedAt: null,
    })),
    assetIdParam ? getAdminMediaAssetById(assetIdParam) : Promise.resolve(null),
  ]);

  const assets = assetsPage.items;
  const selectedMedia = selectedAsset;
  const selectedAssetMissing = Boolean(assetIdParam) && selectedMedia === null;
  const selectionMessage = selectedAssetMissing
    ? "Le média sélectionné n'est plus disponible."
    : null;
  const currentPage = assetsPage.currentPage;
  const rangeStart = assets.length > 0 ? (currentPage - 1) * assetsPage.pageSize + 1 : 0;
  const rangeEnd = assets.length > 0 ? rangeStart + assets.length - 1 : 0;

  return (
    <AdminPageShell
      title="Bibliothèque médias"
      scrollBehavior="page"
      contentPreset="table"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Médias" },
      ]}
      topbarAction={
        <Button asChild size="sm" className="w-full sm:min-w-40 sm:w-auto">
          <a href="#admin-media-upload">Importer</a>
        </Button>
      }
    >
      <MediaRouteNav />
      <AdminFormMessage tone="success" message={successMessage} className="shrink-0" />
      <AdminFormMessage tone="error" message={errorMessage} className="shrink-0" />
      <AdminFormMessage
        tone="error"
        message={selectedAssetMissing ? selectionMessage : null}
        className="shrink-0"
      />

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
                  {integerFormatter.format(assetsPage.totalCount)} image
                  {assetsPage.totalCount > 1 ? "s" : ""}
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
                {assets.map((asset) => {
                  const isSelected = selectedMedia?.id === asset.id;

                  return (
                    <Link
                      key={asset.id}
                      href={buildMediaLibraryHref({
                        assetId: asset.id,
                        page: currentPage,
                        ...(errorParam ? { error: errorParam } : {}),
                        ...(statusParam ? { status: statusParam } : {}),
                      })}
                      aria-label={`Afficher ${asset.originalName}`}
                      className="block"
                    >
                      <div
                        className={`overflow-hidden rounded-2xl border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-surface-border-strong hover:shadow-card ${
                          isSelected
                            ? "border-primary/70 ring-2 ring-primary/25"
                            : "border-surface-border/60"
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
                })}
              </div>

              {assetsPage.totalPages > 1 ? (
                <MediaPagination
                  currentPage={currentPage}
                  totalPages={assetsPage.totalPages}
                  {...(selectedMedia?.id ? { selectedAssetId: selectedMedia.id } : {})}
                  {...(statusParam ? { status: statusParam } : {})}
                  {...(errorParam ? { error: errorParam } : {})}
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
            <SelectedMediaAside asset={selectedMedia} currentPage={currentPage} />
          ) : (
            <MediaLibraryAside
              activeAssetCount={mediaStats.activeAssetCount}
              currentPage={currentPage}
              latestImageCreatedAt={mediaStats.latestImageCreatedAt}
              totalCount={assetsPage.totalCount}
              totalImageBytes={mediaStats.totalImageBytes}
            />
          )}
        </aside>
      </div>
    </AdminPageShell>
  );
}

function MediaPagination({
  currentPage,
  totalPages,
  selectedAssetId,
  status,
  error,
}: Readonly<{
  currentPage: number;
  totalPages: number;
  selectedAssetId?: string;
  status?: string;
  error?: string;
}>) {
  const paginationItems = getPaginationItems(currentPage, totalPages);
  const previousHref =
    currentPage > 1
      ? buildMediaLibraryHref({
          page: currentPage - 1,
          ...(selectedAssetId ? { assetId: selectedAssetId } : {}),
          ...(error ? { error } : {}),
          ...(status ? { status } : {}),
        })
      : undefined;
  const nextHref =
    currentPage < totalPages
      ? buildMediaLibraryHref({
          page: currentPage + 1,
          ...(selectedAssetId ? { assetId: selectedAssetId } : {}),
          ...(error ? { error } : {}),
          ...(status ? { status } : {}),
        })
      : undefined;

  return (
    <div className="rounded-2xl border border-surface-border/60 bg-card px-4 py-3 shadow-card">
      <Pagination className="justify-between">
        <PaginationContent>
          <PaginationItem>
            {previousHref ? (
              <PaginationPrevious href={previousHref} text="Précédent" />
            ) : (
              <span className="inline-flex h-8 items-center px-3 text-xs text-muted-foreground">
                Début
              </span>
            )}
          </PaginationItem>
        </PaginationContent>

        <PaginationContent>
          {paginationItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildMediaLibraryHref({
                    page: item,
                    ...(selectedAssetId ? { assetId: selectedAssetId } : {}),
                    ...(error ? { error } : {}),
                    ...(status ? { status } : {}),
                  })}
                  isActive={item === currentPage}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
        </PaginationContent>

        <PaginationContent>
          <PaginationItem>
            {nextHref ? (
              <PaginationNext href={nextHref} text="Suivant" />
            ) : (
              <span className="inline-flex h-8 items-center px-3 text-xs text-muted-foreground">
                Fin
              </span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function MediaLibraryAside({
  activeAssetCount,
  currentPage,
  latestImageCreatedAt,
  totalCount,
  totalImageBytes,
}: Readonly<{
  activeAssetCount: number;
  currentPage: number;
  latestImageCreatedAt: Date | null;
  totalCount: number;
  totalImageBytes: number;
}>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-card shadow-card">
      <div className="grid gap-5 px-5 py-5">
        <div className="grid gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80">
            Médiathèque
          </p>
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            Vue d'ensemble
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            Ce panneau résume la bibliothèque active. Cliquez sur une image pour passer en mode
            détail et gérer ce média.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <InfoTile
            icon={<Library className="size-4" />}
            label="Images actives"
            value={integerFormatter.format(activeAssetCount)}
          />
          <InfoTile
            icon={<ImageIcon className="size-4" />}
            label="Poids cumulé"
            value={formatByteSize(totalImageBytes)}
          />
          <InfoTile
            icon={<HardDrive className="size-4" />}
            label="Dernier import"
            value={
              latestImageCreatedAt ? mediaDateFormatter.format(latestImageCreatedAt) : "Aucun"
            }
          />
        </div>

        <div className="grid gap-2 rounded-2xl border border-surface-border/60 bg-surface-panel/25 px-4 py-4 text-sm">
          <p className="font-medium text-foreground">Repères bibliothèque</p>
          <p className="leading-6 text-muted-foreground">
            {integerFormatter.format(totalCount)} image{totalCount > 1 ? "s" : ""} active
            {totalCount > 1 ? "s" : ""} répartie{totalCount > 1 ? "s" : ""} sur la page{" "}
            {currentPage}.
          </p>
          <p className="leading-6 text-muted-foreground">
            Formats acceptés : {acceptedFormatsLabel}. Taille maximale : {maxFileSizeMb} MB.
          </p>
        </div>

        <div id="admin-media-upload" className="grid gap-4 scroll-mt-24 border-t border-surface-border/60 pt-5">
          <div className="grid gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Import
            </p>
            <h4 className="text-base font-semibold text-foreground">Ajouter une image</h4>
            <p className="text-sm leading-6 text-muted-foreground">
              Le média devient réutilisable immédiatement dans le catalogue et les contenus.
            </p>
          </div>

          <form action={uploadMediaAction} className="grid gap-4">
            <AdminFormField
              htmlFor="media-file"
              label="Image"
              description="JPEG, PNG, WebP ou AVIF. Taille maximale : 10 MB."
              required
            >
              <Input
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="h-11 rounded-2xl border-surface-border bg-card px-3 shadow-none file:mr-3 file:rounded-full file:border file:border-surface-border file:bg-surface-panel file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-foreground"
                id="media-file"
                name="file"
                required
                type="file"
              />
            </AdminFormField>

            <Button type="submit" className="w-full">
              <Upload className="size-4" />
              Importer le média
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SelectedMediaAside({
  asset,
  currentPage,
}: Readonly<{
  asset: AdminMediaListItem;
  currentPage: number;
}>) {
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
          <InfoRow
            label="Ajout"
            value={mediaDateFormatter.format(new Date(asset.createdAt))}
          />
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

function InfoTile({
  icon,
  label,
  value,
}: Readonly<{
  icon: ReactNode;
  label: string;
  value: string;
}>) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/25 px-4 py-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">{icon}</div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
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
