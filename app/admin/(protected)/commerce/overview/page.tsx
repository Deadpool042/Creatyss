import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { CommerceOverviewSections } from "@/features/admin/commerce/components/commerce-overview-sections";
import { getCommerceOverviewStats } from "@/features/admin/commerce/queries/get-commerce-overview-stats.query";

export default async function AdminCommerceOverviewPage() {
  const stats = await getCommerceOverviewStats();

  return (
    <AdminPageShell
      scrollMode="area"
      title="Vue d'ensemble"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <CommerceOverviewSections stats={stats} />
    </AdminPageShell>
  );
}
