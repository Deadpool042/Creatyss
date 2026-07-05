import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
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
    >
      <CommerceSettingsHub cardPaymentStatus={cardPaymentStatus} taxationActive={taxationActive} />
    </AdminPageShell>
  );
}
