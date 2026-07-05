import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_PAYMENTS_LIST_PATH,
  ADMIN_PAYMENTS_SETTINGS_PATH,
} from "@/features/admin/commerce/payments/shared/admin-payments-routes";

const PAYMENT_ROUTE_NAV_ITEMS = [
  { key: "list", label: "Liste", href: ADMIN_PAYMENTS_LIST_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_PAYMENTS_SETTINGS_PATH },
] as const;

export function PaymentRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation paiements"
      items={PAYMENT_ROUTE_NAV_ITEMS}
      sectionLabel="Paiements"
      className={className}
    />
  );
}
