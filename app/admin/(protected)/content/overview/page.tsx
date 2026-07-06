import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ContentRouteNav } from "@/features/admin/content/components/content-route-nav";
import { ContentOverviewSections } from "@/features/admin/content/components/content-overview-sections";
import { getContentOverviewStats } from "@/features/admin/content/queries/get-content-overview-stats.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export default async function AdminContentOverviewPage() {
  const [stats, canPublishBlog] = await Promise.all([
    getContentOverviewStats(),
    meetsFeatureLevel("content.blog", "publish"),
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Contenu"
      contentPreset="overview"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Contenu" }]}
      showTitleInContent={false}
      header={
        <AdminPageHeader
          title="Contenu"
          description="Vue d'ensemble du blog, des pages statiques et du référencement."
        />
      }
    >
      <ContentRouteNav />
      <ContentOverviewSections stats={stats} canPublishBlog={canPublishBlog} />
    </AdminPageShell>
  );
}
