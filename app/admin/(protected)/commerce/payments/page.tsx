import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { isPaymentsFeatureActive } from "@/features/admin/commerce/queries/is-payments-feature-active.query";
import { CreditCard } from "lucide-react";

export default async function AdminCommercePaymentsPage() {
  const featureActive = await isPaymentsFeatureActive();
  if (!featureActive) notFound();
  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Paiements"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Commerce", href: "/admin/commerce/overview" }, { label: "Paiements" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Paiements"
        description="Suivi des transactions, statuts de paiement, remboursements et rapprochements. Connecté au prestataire de paiement configuré dans les réglages."
        docRef="docs/domains/optional/commerce/payments.md"
        requirements={["Module commerce.payments activé (feature flag)", "Schéma Prisma : prisma/optional/commerce/payments.prisma"]}
        icon={CreditCard}
        fallbackAction={{ label: "Voir les commandes", href: "/admin/commerce/orders" }}
      />
    </AdminPageShell>
  );
}
