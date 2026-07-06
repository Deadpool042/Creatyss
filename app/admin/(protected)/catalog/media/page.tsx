import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import {
  getAdminMediaAssetById,
  getAdminMediaUsageSummary,
  listAdminMediaAssets,
} from "@/features/admin/media";
import { AdminMediaDesktopUploadDialog } from "@/features/admin/media/components/admin-media-desktop-upload-dialog";
import { AdminMediaLibraryView } from "@/features/admin/media/components/admin-media-library-view";
import {
  ADMIN_MEDIA_PER_PAGE_OPTIONS,
  ADMIN_MEDIA_PAGE_SIZE,
  parseAdminMediaFormatFilter,
  parseAdminMediaLibraryView,
  parseAdminMediaSortOption,
  parseAdminMediaUsageFilter,
  getErrorMessage,
  getSingleSearchParam,
  parseOptionalPositiveInt,
  parsePositiveInt,
} from "@/features/admin/media/components/admin-media-library-helpers";
import { MediaRouteNav } from "@/features/admin/media/components/media-route-nav";
import { getAdminMediaStats } from "@/features/admin/settings/queries/get-media-stats.query";

export const dynamic = "force-dynamic";

type MediaPageProps = Readonly<{
  searchParams: Promise<{
    assetId?: string | string[];
    error?: string | string[];
    format?: string | string[];
    page?: string | string[];
    perPage?: string | string[];
    q?: string | string[];
    sort?: string | string[];
    status?: string | string[];
    usage?: string | string[];
    view?: string | string[];
  }>;
}>;

export default async function AdminMediaPage({ searchParams }: MediaPageProps) {
  const resolvedSearchParams = await searchParams;
  const statusParam = getSingleSearchParam(resolvedSearchParams.status);
  const errorParam = getSingleSearchParam(resolvedSearchParams.error);
  const assetIdParam = getSingleSearchParam(resolvedSearchParams.assetId)?.trim() || undefined;
  const query = getSingleSearchParam(resolvedSearchParams.q)?.trim() ?? "";
  const sort = parseAdminMediaSortOption(getSingleSearchParam(resolvedSearchParams.sort));
  const format = parseAdminMediaFormatFilter(getSingleSearchParam(resolvedSearchParams.format));
  const usage = parseAdminMediaUsageFilter(getSingleSearchParam(resolvedSearchParams.usage));
  const view = parseAdminMediaLibraryView(getSingleSearchParam(resolvedSearchParams.view));
  const requestedPage = parsePositiveInt(getSingleSearchParam(resolvedSearchParams.page));
  const requestedPerPage = parseOptionalPositiveInt(
    getSingleSearchParam(resolvedSearchParams.perPage)
  );
  const perPage =
    requestedPerPage &&
    ADMIN_MEDIA_PER_PAGE_OPTIONS.includes(
      requestedPerPage as (typeof ADMIN_MEDIA_PER_PAGE_OPTIONS)[number]
    )
      ? requestedPerPage
      : ADMIN_MEDIA_PAGE_SIZE;

  const successMessage =
    statusParam === "uploaded"
      ? "Média importé avec succès."
      : statusParam === "archived"
        ? "Média archivé. Il n'apparaît plus dans la bibliothèque."
        : statusParam === "restored"
          ? "Média restauré dans la bibliothèque active."
          : statusParam === "deleted"
            ? "Média supprimé définitivement."
            : statusParam === "saved"
              ? "Métadonnées du média enregistrées."
              : null;

  const [assetsPage, mediaStats, selectedMedia, selectedMediaUsage] = await Promise.all([
    listAdminMediaAssets({
      format,
      page: requestedPage,
      pageSize: perPage,
      query,
      sort,
      usage,
      view,
    }),
    getAdminMediaStats().catch(() => ({
      activeAssetCount: 0,
      totalImageBytes: 0,
      latestImageCreatedAt: null,
    })),
    assetIdParam ? getAdminMediaAssetById({ id: assetIdParam, view }) : Promise.resolve(null),
    assetIdParam
      ? getAdminMediaUsageSummary(assetIdParam).catch(() => ({
          brandingCount: 0,
          categoriesCount: 0,
          contentCount: 0,
          productsCount: 0,
          seoCount: 0,
        }))
      : Promise.resolve(null),
  ]);

  const selectedAssetMissing = Boolean(assetIdParam) && selectedMedia === null;

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
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Catalogue"
          title="Bibliothèque médias"
          description="Import, organisation et usages des images et fichiers du catalogue."
        />
      }
      topbarAction={
        view === "active" ? (
          <AdminMediaDesktopUploadDialog
            searchState={{
              ...(perPage !== ADMIN_MEDIA_PAGE_SIZE ? { perPage } : {}),
              ...(query ? { q: query } : {}),
              ...(sort ? { sort } : {}),
              ...(format ? { format } : {}),
              ...(usage ? { usage } : {}),
              ...(view ? { view } : {}),
            }}
          />
        ) : undefined
      }
    >
      <MediaRouteNav />
      <AdminFormMessage tone="success" message={successMessage} className="shrink-0" />
      <AdminFormMessage tone="error" message={getErrorMessage(errorParam)} className="shrink-0" />
      <AdminFormMessage
        tone="error"
        message={selectedAssetMissing ? "Le média sélectionné n'est plus disponible." : null}
        className="shrink-0"
      />

      <AdminMediaLibraryView
        assets={assetsPage.items}
        currentPage={assetsPage.currentPage}
        {...(errorParam ? { error: errorParam } : {})}
        format={format}
        mediaStats={mediaStats}
        perPage={assetsPage.pageSize}
        query={query}
        selectedMedia={selectedMedia}
        selectedMediaUsage={selectedMedia ? selectedMediaUsage : null}
        sort={sort}
        usage={usage}
        view={view}
        {...(statusParam ? { status: statusParam } : {})}
        totalCount={assetsPage.totalCount}
        totalPages={assetsPage.totalPages}
      />
    </AdminPageShell>
  );
}
