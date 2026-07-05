import { AdminSectionRouteNav } from "@/components/admin/layout/admin-section-route-nav";
import {
  ADMIN_CONTENT_BLOG_PATH,
  ADMIN_CONTENT_HOMEPAGE_PATH,
  ADMIN_CONTENT_OVERVIEW_PATH,
  ADMIN_CONTENT_PAGES_PATH,
  ADMIN_CONTENT_SEO_PATH,
} from "@/features/admin/content/shared/admin-content-routes";

const CONTENT_ROUTE_NAV_ITEMS = [
  { key: "overview", label: "Pilotage", href: ADMIN_CONTENT_OVERVIEW_PATH },
  { key: "blog", label: "Blog", href: ADMIN_CONTENT_BLOG_PATH },
  { key: "pages", label: "Pages", href: ADMIN_CONTENT_PAGES_PATH },
  { key: "homepage", label: "Accueil", href: ADMIN_CONTENT_HOMEPAGE_PATH },
  { key: "seo", label: "SEO", href: ADMIN_CONTENT_SEO_PATH },
] as const;

export function ContentRouteNav({ className }: Readonly<{ className?: string }>) {
  return (
    <AdminSectionRouteNav
      ariaLabel="Navigation contenu"
      items={CONTENT_ROUTE_NAV_ITEMS}
      className={className}
    />
  );
}
