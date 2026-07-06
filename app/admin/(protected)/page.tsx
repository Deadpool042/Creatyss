//app/admin/(protected)/page.tsx
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminDashboardSections } from "@/components/admin/dashboard";
import { getAdminDashboardStats } from "@/features/admin/dashboard";
import { DASHBOARD_PAGE_COPY } from "@/entities/languages/fr/admin/dashboard/dashboard_fr";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title={DASHBOARD_PAGE_COPY.title}
      breadcrumbs={[{ label: DASHBOARD_PAGE_COPY.title }]}
      contentPreset="dashboard"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      header={
        <AdminPageHeader
          title={DASHBOARD_PAGE_COPY.title}
          description="Vue d'ensemble de l'activité de la boutique : ventes, commandes et alertes récentes."
        />
      }
    >
      <AdminDashboardSections stats={stats} />
    </AdminPageShell>
  );
}
