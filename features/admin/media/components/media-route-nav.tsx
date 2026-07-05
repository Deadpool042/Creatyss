import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_CATALOG_MEDIA_PATH,
  ADMIN_CATALOG_MEDIA_SETTINGS_PATH,
} from "@/features/admin/catalog/shared/admin-catalog-routes";

const MEDIA_ROUTE_NAV_ITEMS = [
  { key: "library", label: "Bibliothèque", href: ADMIN_CATALOG_MEDIA_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_CATALOG_MEDIA_SETTINGS_PATH },
] as const;

export function MediaRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation médias"
      items={MEDIA_ROUTE_NAV_ITEMS}
      mobileVariant="settings-shortcut"
      sectionLabel="Médias"
      className={className}
    />
  );
}
