import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";

const MAINTENANCE_ROUTE_NAV_ITEMS = [
  { key: "overview", label: "Vue d'ensemble", href: "/admin/maintenance/overview" },
  { key: "logs", label: "Jobs", href: "/admin/maintenance/logs" },
] as const;

export function MaintenanceRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation maintenance"
      items={MAINTENANCE_ROUTE_NAV_ITEMS}
      className={className}
    />
  );
}
