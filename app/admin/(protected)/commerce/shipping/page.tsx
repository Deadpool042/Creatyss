import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { isShippingFeatureActive } from "@/features/admin/commerce/queries/is-shipping-feature-active.query";
import { Truck } from "lucide-react";

export default async function AdminCommerceShippingPage() {
  const featureActive = await isShippingFeatureActive();
  if (!featureActive) notFound();
  return (
    <AdminPageShell
      scrollMode="area"
      title="Livraisons"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Commerce", href: "/admin/commerce/overview" }, { label: "Livraisons" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Livraisons"
        description="Gestion des expéditions, transporteurs, numéros de suivi et notifications clients. Intégration Colissimo, Mondial Relay, etc."
        docRef="docs/domains/optional/commerce/shipping.md"
        requirements={["Module commerce.shipping activé (feature flag)", "Schéma Prisma : prisma/optional/commerce/shipping.prisma"]}
        icon={Truck}
        fallbackAction={{ label: "Voir les commandes", href: "/admin/commerce/orders" }}
      />
    </AdminPageShell>
  );
}
