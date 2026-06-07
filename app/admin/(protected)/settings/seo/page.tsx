import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Search } from "lucide-react";

export default function AdminSettingsSeoPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="SEO"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "SEO" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Réglages SEO"
        description="Configuration des métadonnées globales, des sitemaps, des balises structurées et des redirections."
        docRef="docs/domains/cross-cutting/seo.md"
        requirements={["Module transverse : SEO", "Feature flag : content.seo"]}
        icon={Search}
      />
    </AdminPageShell>
  );
}
