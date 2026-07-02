import { Users } from "lucide-react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { CustomerRouteNav } from "@/features/admin/customers/components";

export default async function AdminCommerceCustomersSettingsPage() {
  await requireAdminCapability("admin.settings.customers.read");

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Clients"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Clients", href: "/admin/commerce/customers" },
        { label: "Configuration" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <CustomerRouteNav />
      <AdminComingSoon
        title="Réglages clients"
        description="Politiques de compte client, durée de rétention des données et paramètres RGPD. Ces réglages seront disponibles avec la gestion avancée des clients."
        docRef="docs/roadmap/h3-administration-avancee/lot-clients-historique-crm.md"
        icon={Users}
      />
    </AdminPageShell>
  );
}
