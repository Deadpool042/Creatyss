import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Package } from "lucide-react";

export default function AdminSettingsCatalogPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="Catalogue"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Catalogue" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Réglages du catalogue"
        description="Configuration des variantes, disponibilité, tarification et organisation des produits."
        docRef="docs/domains/core/catalog/products.md"
        requirements={["Module core : catalogue", "Feature flag : catalog.products.related"]}
        icon={Package}
      />
    </AdminPageShell>
  );
}
