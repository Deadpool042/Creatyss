import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminFormMessage } from "@/components/admin/forms/admin-form-message";
import { Button } from "@/components/ui/button";
import {
  getAdminMediaAssetById,
  listAdminMediaAssets,
} from "@/features/admin/media";
import { AdminMediaLibraryView } from "@/features/admin/media/components/admin-media-library-view";
import {
  ADMIN_MEDIA_PAGE_SIZE,
  getErrorMessage,
  getSingleSearchParam,
  parsePositiveInt,
} from "@/features/admin/media/components/admin-media-library-helpers";
import { MediaRouteNav } from "@/features/admin/media/components/media-route-nav";
import { getAdminMediaStats } from "@/features/admin/settings/queries/get-media-stats.query";

export const dynamic = "force-dynamic";

type MediaPageProps = Readonly<{
  searchParams: Promise<{
    assetId?: string | string[];
    error?: string | string[];
    page?: string | string[];
    status?: string | string[];
  }>;
}>;

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

  const [assetsPage, mediaStats, selectedMedia] = await Promise.all([
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
      topbarAction={
        <Button asChild size="sm" className="w-full sm:min-w-40 sm:w-auto">
          <a href="#admin-media-upload">Importer</a>
        </Button>
      }
    >
      <MediaRouteNav />
      <AdminFormMessage tone="success" message={successMessage} className="shrink-0" />
      <AdminFormMessage
        tone="error"
        message={getErrorMessage(errorParam)}
        className="shrink-0"
      />
      <AdminFormMessage
        tone="error"
        message={selectedAssetMissing ? "Le média sélectionné n'est plus disponible." : null}
        className="shrink-0"
      />

      <AdminMediaLibraryView
        assets={assetsPage.items}
        currentPage={assetsPage.currentPage}
        {...(errorParam ? { error: errorParam } : {})}
        mediaStats={mediaStats}
        selectedMedia={selectedMedia}
        {...(statusParam ? { status: statusParam } : {})}
        totalCount={assetsPage.totalCount}
        totalPages={assetsPage.totalPages}
      />
    </AdminPageShell>
  );
}
