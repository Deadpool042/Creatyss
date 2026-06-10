import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { isPaymentsFeatureActive } from "@/features/admin/commerce/queries/is-payments-feature-active.query";
import { listAdminPayments } from "@/features/admin/commerce/payments/list/queries/list-admin-payments.query";
import { AdminPaymentsList } from "@/features/admin/commerce/payments/list/components/admin-payments-list";

export const dynamic = "force-dynamic";

export default async function AdminCommercePaymentsPage() {
  const featureActive = await isPaymentsFeatureActive();
  if (!featureActive) notFound();

  await requireAdminCapability("admin.commerce.payments.read");

  const result = await listAdminPayments();

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
      <AdminPaymentsList payments={result.items} />
    </AdminPageShell>
  );
}
