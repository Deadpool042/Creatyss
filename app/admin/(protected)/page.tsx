//app/admin/(protected)/page.tsx
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminDashboardSections } from "@/components/admin/dashboard";
import { getAdminDashboardStats } from "@/features/admin/dashboard";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Tableau de bord"
      breadcrumbs={[{ label: "Tableau de bord" }]}
      contentPreset="dashboard"
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminDashboardSections stats={stats} />
    </AdminPageShell>
  );
}
