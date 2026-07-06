import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";

const INSIGHTS_ROUTE_NAV_ITEMS = [
  { key: "overview", label: "Vue d'ensemble", href: "/admin/insights/overview" },
  { key: "analytics", label: "Analyses", href: "/admin/insights/analytics" },
] as const;

export function InsightsRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation pilotage"
      items={INSIGHTS_ROUTE_NAV_ITEMS}
      className={className}
    />
  );
}
