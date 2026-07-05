import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { CommerceOverviewSections } from "@/features/admin/commerce/components/commerce-overview-sections";
import { getCommerceOverviewStats } from "@/features/admin/commerce/queries/get-commerce-overview-stats.query";

export default async function AdminCommerceOverviewPage() {
  const stats = await getCommerceOverviewStats();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Vue d'ensemble"
      contentPreset="overview"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce" },
      ]}
      showTitleInContent={false}
    >
      <CommerceOverviewSections stats={stats} />
    </AdminPageShell>
  );
}
