import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { CatalogOverviewSections } from "@/features/admin/catalog/components/catalog-overview-sections";
import { getCatalogOverviewStats } from "@/features/admin/catalog/queries/get-catalog-overview-stats.query";

export default async function CatalogOverviewPage() {
  const stats = await getCatalogOverviewStats();

  return (
    <AdminPageShell
      scrollMode="area"
      title="Vue d'ensemble du catalogue"
      contentPreset="full-width"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue" },
      ]}
    >
      <CatalogOverviewSections stats={stats} />
    </AdminPageShell>
  );
}
