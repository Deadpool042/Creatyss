import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { isPaymentsFeatureActive } from "@/features/admin/commerce/queries/is-payments-feature-active.query";
import { listAdminPayments } from "@/features/admin/commerce/payments/list/queries/list-admin-payments.query";
import { AdminPaymentsList } from "@/features/admin/commerce/payments/list/components/admin-payments-list";
import { PaymentRouteNav } from "@/features/admin/commerce/payments/shared/components/payment-route-nav";

export const dynamic = "force-dynamic";

export default async function AdminCommercePaymentsPage() {
  const featureActive = await isPaymentsFeatureActive();
  if (!featureActive) notFound();

  await requireAdminCapability("admin.commerce.payments.read");

  const storeId = await getCurrentStoreId();
  if (!storeId) notFound();

  const result = await listAdminPayments(storeId);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Paiements"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Commerce", href: "/admin/commerce/overview" },
        { label: "Paiements" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
      <PaymentRouteNav />
      <AdminPaymentsList payments={result.items} />
    </AdminPageShell>
  );
}
