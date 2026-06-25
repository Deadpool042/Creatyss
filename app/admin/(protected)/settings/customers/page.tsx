import { Users } from "lucide-react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";

export default async function AdminSettingsCustomersPage() {
  await requireAdminCapability("admin.settings.customers.read");

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Clients"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Clients" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <AdminComingSoon
        title="Réglages clients"
        description="Politiques de compte client, durée de rétention des données et paramètres RGPD. Ces réglages seront disponibles avec la gestion avancée des clients."
        docRef="docs/roadmap/h3-administration-avancee/lot-clients-historique-crm.md"
        icon={Users}
        fallbackAction={{
          label: "Voir les clients",
          href: "/admin/commerce/customers",
        }}
      />
    </AdminPageShell>
  );
}
