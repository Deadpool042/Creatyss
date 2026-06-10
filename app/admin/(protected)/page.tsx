//app/admin/(protected)/page.tsx
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
    >
      <AdminDashboardSections stats={stats} />
    </AdminPageShell>
  );
}
