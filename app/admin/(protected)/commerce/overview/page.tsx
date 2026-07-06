import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { CommerceOverviewSections } from "@/features/admin/commerce/components/commerce-overview-sections";
import { CommerceRouteNav } from "@/features/admin/commerce/components/commerce-route-nav";
import { getCommerceOverviewStats } from "@/features/admin/commerce/queries/get-commerce-overview-stats.query";

export default async function AdminCommerceOverviewPage() {
  const stats = await getCommerceOverviewStats();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Vue d'ensemble"
      contentPreset="overview"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Commerce" }]}
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Commerce"
          title="Vue d'ensemble"
          description="Statistiques agrégées sur les commandes, paiements et livraisons du commerce."
        />
      }
    >
      <CommerceRouteNav />
      <CommerceOverviewSections stats={stats} />
    </AdminPageShell>
  );
}
