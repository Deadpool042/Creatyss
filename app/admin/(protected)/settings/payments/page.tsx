import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { CreditCard } from "lucide-react";

export default function AdminSettingsPaymentsPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="Paiements"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Paiements" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Réglages de paiement"
        description="Connexion aux prestataires de paiement (Stripe, etc.), clés API, modes de paiement acceptés et configuration des webhooks."
        docRef="docs/domains/optional/commerce/payments.md"
        icon={CreditCard}
      />
    </AdminPageShell>
  );
}
