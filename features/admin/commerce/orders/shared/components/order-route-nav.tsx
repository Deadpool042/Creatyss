import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_ORDERS_LIST_PATH,
  ADMIN_ORDERS_SETTINGS_PATH,
} from "@/features/admin/commerce/orders/shared/admin-orders-routes";

const ORDER_ROUTE_NAV_ITEMS = [
  { key: "list", label: "Liste", href: ADMIN_ORDERS_LIST_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_ORDERS_SETTINGS_PATH },
] as const;

export function OrderRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation commandes"
      items={ORDER_ROUTE_NAV_ITEMS}
      sectionLabel="Commandes"
      className={className}
      isItemActive={(pathname, item) =>
        item.key === "list"
          ? pathname === item.href ||
            (pathname.startsWith(`${item.href}/`) && pathname !== ADMIN_ORDERS_SETTINGS_PATH)
          : pathname === item.href
      }
    />
  );
}
