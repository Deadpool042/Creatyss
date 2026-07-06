import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { MaintenanceRouteNav } from "@/features/admin/maintenance/components/maintenance-route-nav";
import { MaintenanceOverviewSections } from "@/features/admin/maintenance/components/maintenance-overview-sections";
import {
  getAdminSystemHealth,
  type AdminSystemHealth,
} from "@/features/admin/maintenance/queries/get-admin-system-health.query";

export const dynamic = "force-dynamic";

export default async function AdminMaintenanceOverviewPage() {
  await requireAuthenticatedAdmin();

  let health: AdminSystemHealth = {
    audit: { total: 0, critical: 0, warning: 0, recent: [] },
    events: { total: 0, pending: 0, failed: 0 },
    jobs: { pending: 0, running: 0, failed: 0 },
  };
  let dbOk = true;

  try {
    health = await getAdminSystemHealth();
  } catch (error) {
    console.error("[maintenance/overview] getAdminSystemHealth failed", error);
    dbOk = false;
  }

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Maintenance"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Maintenance" },
        { label: "Vue d'ensemble" },
      ]}
      showTitleInContent={false}
      contentPreset="overview"
      header={
        <AdminPageHeader
          eyebrow="Maintenance"
          title="Vue d'ensemble"
          description="Santé des jobs, événements domaine, services et audit."
        />
      }
    >
      <MaintenanceRouteNav />
      <MaintenanceOverviewSections health={health} dbOk={dbOk} />
    </AdminPageShell>
  );
}
