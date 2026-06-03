import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { CreditCard } from "lucide-react";

export default function AdminCommercePaymentsPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="Paiements"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Commerce", href: "/admin/commerce/overview" }, { label: "Paiements" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Paiements"
        description="Suivi des transactions, statuts de paiement, remboursements et rapprochements. Connecté au prestataire de paiement configuré dans les réglages."
        docRef="docs/domains/optional/payments.md"
        requirements={["Prestataire configuré dans Réglages > Paiements"]}
        icon={CreditCard}
        fallbackAction={{ label: "Voir les commandes", href: "/admin/commerce/orders" }}
      />
    </AdminPageShell>
  );
}
