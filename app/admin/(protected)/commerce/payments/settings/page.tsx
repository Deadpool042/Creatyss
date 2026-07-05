import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
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
    >
      <PaymentRouteNav />
      <div className="space-y-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            Réglages
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Réglages de paiement
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Moyens de paiement proposés à vos clientes : virement bancaire et paiement à
            l&apos;atelier.
          </p>
        </div>

        <CardPaymentStatusNotice status={cardPaymentStatus} />

        <PaymentSettingsForm settings={settings} />
      </div>
    </AdminPageShell>
  );
}
