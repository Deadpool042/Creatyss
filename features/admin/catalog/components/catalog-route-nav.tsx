import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_CATALOG_OVERVIEW_PATH,
  ADMIN_CATALOG_PRICING_PATH,
  ADMIN_CATALOG_SETTINGS_PATH,
} from "@/features/admin/catalog/shared/admin-catalog-routes";

const CATALOG_ROUTE_NAV_ITEMS = [
  { key: "overview", label: "Pilotage", href: ADMIN_CATALOG_OVERVIEW_PATH },
  { key: "pricing", label: "Tarification", href: ADMIN_CATALOG_PRICING_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_CATALOG_SETTINGS_PATH },
] as const;

export function CatalogRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation catalogue"
      items={CATALOG_ROUTE_NAV_ITEMS}
      className={className}
    />
  );
}
