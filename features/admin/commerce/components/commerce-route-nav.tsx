import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_COMMERCE_OVERVIEW_PATH,
  ADMIN_COMMERCE_SETTINGS_PATH,
  ADMIN_COMMERCE_TAXATION_PATH,
} from "@/features/admin/commerce/shared/admin-commerce-routes";

const COMMERCE_ROUTE_NAV_ITEMS = [
  { key: "overview", label: "Pilotage", href: ADMIN_COMMERCE_OVERVIEW_PATH },
  { key: "taxation", label: "TVA", href: ADMIN_COMMERCE_TAXATION_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_COMMERCE_SETTINGS_PATH },
] as const;

export function CommerceRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation commerce"
      items={COMMERCE_ROUTE_NAV_ITEMS}
      className={className}
    />
  );
}
