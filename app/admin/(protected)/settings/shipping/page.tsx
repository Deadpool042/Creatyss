import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Truck } from "lucide-react";

export default function AdminSettingsShippingPage() {
  return (
    <AdminPageShell
      scrollMode="area"
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
