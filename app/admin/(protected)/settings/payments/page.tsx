import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { CreditCard } from "lucide-react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";

export default async function AdminSettingsPaymentsPage() {
  await requireAdminCapability("admin.settings.payments.read");
  return (
    <AdminPageShell
      scrollBehavior="page"
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
