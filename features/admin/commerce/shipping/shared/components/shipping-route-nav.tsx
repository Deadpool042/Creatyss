import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_SHIPPING_LIST_PATH,
  ADMIN_SHIPPING_SETTINGS_PATH,
} from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";

const SHIPPING_ROUTE_NAV_ITEMS = [
  { key: "list", label: "Liste", href: ADMIN_SHIPPING_LIST_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_SHIPPING_SETTINGS_PATH },
] as const;

export function ShippingRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation livraisons"
      items={SHIPPING_ROUTE_NAV_ITEMS}
      sectionLabel="Livraisons"
      className={className}
    />
  );
}
