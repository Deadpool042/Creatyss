import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { PaymentRouteNav } from "@/features/admin/commerce/payments/shared/components/payment-route-nav";
import { CardPaymentStatusNotice } from "@/features/admin/settings/components/card-payment-status-notice";
import { PaymentSettingsForm } from "@/features/admin/settings/components/payment-settings-form";
import { getAdminPaymentSettings } from "@/features/admin/settings/queries/get-admin-payment-settings.query";
import { getCardPaymentStatus } from "@/features/admin/settings/queries/get-card-payment-status.query";

export default async function AdminCommercePaymentsSettingsPage() {
  await requireAdminCapability("admin.settings.payments.read");
  const settings = await getAdminPaymentSettings();
  const cardPaymentStatus = await getCardPaymentStatus();

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Paiements"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Paiements", href: "/admin/commerce/payments" },
        { label: "Configuration" },
      ]}
      showTitleInContent={false}
      contentPreset="form"
      header={
        <AdminPageHeader
          eyebrow="Réglages"
          title="Réglages de paiement"
          description="Moyens de paiement proposés à vos clientes : virement bancaire et paiement à l'atelier."
        />
      }
    >
      <PaymentRouteNav />
      <div className="space-y-8">
        <CardPaymentStatusNotice status={cardPaymentStatus} />

        <PaymentSettingsForm settings={settings} />
      </div>
    </AdminPageShell>
  );
}
