import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Truck } from "lucide-react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";

export default async function AdminSettingsShippingPage() {
  await requireAdminCapability("admin.settings.shipping.read");
  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Livraison"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Livraison" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Réglages de livraison"
        description="Zones de livraison, transporteurs, tarifs et délais. Règles de franchise de port et options de retrait en point relais."
        docRef="docs/domains/optional/commerce/shipping.md"
        icon={Truck}
      />
    </AdminPageShell>
  );
}
