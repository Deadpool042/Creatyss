import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { ShoppingCart } from "lucide-react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";

export default async function AdminSettingsOrdersPage() {
  await requireAdminCapability("admin.settings.orders.read");
  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Commandes"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Commandes" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Réglages des commandes"
        description="Traitement des commandes, gestion des retours, documents commerciaux et règles fiscales."
        docRef="docs/domains/core/commerce/orders.md"
        requirements={["Module core : commandes", "Module optionnel : documents commerciaux"]}
        icon={ShoppingCart}
      />
    </AdminPageShell>
  );
}
