import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { CommerceRouteNav } from "@/features/admin/commerce/components/commerce-route-nav";
import { CommerceSettingsHub } from "@/features/admin/settings/components/commerce-settings-hub";
import { getCardPaymentStatus } from "@/features/admin/settings/queries/get-card-payment-status.query";
import { isTaxationFeatureActive } from "@/features/admin/commerce/taxation/queries/is-taxation-feature-active.query";

export const dynamic = "force-dynamic";

export default async function AdminCommerceSettingsPage() {
  await requireAdminCapability("admin.settings.payments.read");

  const [cardPaymentStatus, taxationActive] = await Promise.all([
    getCardPaymentStatus(),
    isTaxationFeatureActive(),
  ]);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Configuration commerce"
      contentPreset="table"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Configuration" },
      ]}
      showTitleInContent={false}
      header={
        <AdminPageHeader
          eyebrow="Commerce"
          title="Configuration commerce"
          description="Statut des moyens de paiement et de la taxation, pilotés depuis les Réglages avancés."
        />
      }
    >
      <CommerceRouteNav />
      <CommerceSettingsHub cardPaymentStatus={cardPaymentStatus} taxationActive={taxationActive} />
    </AdminPageShell>
  );
}
