import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { CatalogRouteNav } from "@/features/admin/catalog/components/catalog-route-nav";
import { CatalogOverviewSections } from "@/features/admin/catalog/components/catalog-overview-sections";
import { getCatalogOverviewStats } from "@/features/admin/catalog/queries/get-catalog-overview-stats.query";

export default async function CatalogOverviewPage() {
  const stats = await getCatalogOverviewStats();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Vue d'ensemble du catalogue"
      contentPreset="dashboard"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Catalogue" }]}
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Catalogue"
          title="Vue d'ensemble du catalogue"
          description="Statistiques agrégées sur les produits, catégories et stocks du catalogue."
        />
      }
    >
      <CatalogRouteNav />
      <CatalogOverviewSections stats={stats} />
    </AdminPageShell>
  );
}
