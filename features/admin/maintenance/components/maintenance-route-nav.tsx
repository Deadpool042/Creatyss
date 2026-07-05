import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";

const MAINTENANCE_ROUTE_NAV_ITEMS = [
  { key: "logs", label: "Jobs", href: "/admin/maintenance/logs" },
  { key: "monitoring", label: "Monitoring", href: "/admin/maintenance/monitoring" },
  { key: "observability", label: "Observabilité", href: "/admin/maintenance/observability" },
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
