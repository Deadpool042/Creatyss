import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_CUSTOMERS_LIST_PATH,
  ADMIN_CUSTOMERS_SETTINGS_PATH,
} from "@/features/admin/customers/shared";

const CUSTOMER_ROUTE_NAV_ITEMS = [
  { key: "list", label: "Liste", href: ADMIN_CUSTOMERS_LIST_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_CUSTOMERS_SETTINGS_PATH },
] as const;

export function CustomerRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation clients"
      items={CUSTOMER_ROUTE_NAV_ITEMS}
      sectionLabel="Clients"
      className={className}
    />
  );
}
