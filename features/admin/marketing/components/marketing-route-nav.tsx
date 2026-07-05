import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import { ADMIN_AUTOMATIONS_PATH } from "@/features/admin/marketing/automations/shared/admin-automations-routes";
import { ADMIN_DISCOUNTS_PATH } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";
import { ADMIN_NEWSLETTER_PATH } from "@/features/admin/marketing/newsletter/shared/admin-newsletter-routes";
import {
  ADMIN_MARKETING_OVERVIEW_PATH,
  ADMIN_MARKETING_SETTINGS_PATH,
} from "@/features/admin/marketing/shared/admin-marketing-routes";

const MARKETING_ROUTE_NAV_ITEMS = [
  { key: "overview", label: "Pilotage", href: ADMIN_MARKETING_OVERVIEW_PATH },
  { key: "discounts", label: "Codes promo", href: ADMIN_DISCOUNTS_PATH },
  { key: "newsletter", label: "Newsletter", href: ADMIN_NEWSLETTER_PATH },
  { key: "automations", label: "Automations", href: ADMIN_AUTOMATIONS_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_MARKETING_SETTINGS_PATH },
] as const;

export function MarketingRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation marketing"
      items={MARKETING_ROUTE_NAV_ITEMS}
      className={className}
    />
  );
}
