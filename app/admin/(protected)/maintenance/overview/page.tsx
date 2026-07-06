import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { db } from "@/core/db";
import { adminNavigationItems } from "@/features/admin/navigation";
import {
  getAdminNavigationContext,
  hasAdminNavigationAccess,
} from "@/features/admin/navigation/server";
import { MaintenanceRouteNav } from "@/features/admin/maintenance/components/maintenance-route-nav";
import { MaintenanceOverviewSections } from "@/features/admin/maintenance/components/maintenance-overview-sections";
import {
  getAdminSystemHealth,
  type AdminSystemHealth,
} from "@/features/admin/maintenance/queries/get-admin-system-health.query";

export const dynamic = "force-dynamic";

export default async function AdminMaintenanceOverviewPage() {
  const admin = await requireAuthenticatedAdmin();

  const navigationContext = await getAdminNavigationContext({
    db,
    admin: { id: admin.id, email: admin.email },
  });

  const cards = adminNavigationItems
    .filter((item) => item.group === "maintenance" && item.key !== "maintenance-overview")
    .filter((item) => hasAdminNavigationAccess(item, navigationContext))
    .sort((a, b) => a.order - b.order);

  let health: AdminSystemHealth = {
    audit: { total: 0, critical: 0, warning: 0, recent: [] },
    events: { total: 0, pending: 0, failed: 0 },
    jobs: { pending: 0, running: 0, failed: 0 },
  };

  try {
    health = await getAdminSystemHealth();
  } catch {
    // Tables non disponibles — état par défaut
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
          description="Santé des jobs, événements domaine et audit, avec accès rapide aux outils de diagnostic."
        />
      }
    >
      <MaintenanceRouteNav />
      <MaintenanceOverviewSections health={health} cards={cards} />
    </AdminPageShell>
  );
}
