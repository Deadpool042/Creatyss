import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { isDiscountsFeatureActive } from "@/features/admin/marketing/queries/is-discounts-feature-active.query";
import { Percent } from "lucide-react";

export default async function AdminMarketingDiscountsPage() {
  const featureActive = await isDiscountsFeatureActive();
  if (!featureActive) notFound();
  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Codes promo"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing", href: "/admin/marketing/overview" }, { label: "Réductions" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Codes promo"
        description="Créez des codes de réduction, planifiez des promotions automatiques et définissez les conditions d'application sur le catalogue ou le panier."
        docRef="docs/domains/satellites/discounts.md"
        requirements={["Feature flag : commerce.discounts", "Capability : marketing.discountsRead"]}
        icon={Percent}
      />
    </AdminPageShell>
  );
}
