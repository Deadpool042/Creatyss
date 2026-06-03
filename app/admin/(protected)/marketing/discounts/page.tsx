import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Percent } from "lucide-react";

export default function AdminMarketingDiscountsPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="Codes promo"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing", href: "/admin/marketing/overview" }, { label: "Réductions" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Codes promo"
        description="Créez des codes de réduction, planifiez des promotions automatiques et définissez les conditions d'application sur le catalogue ou le panier."
        docRef="prisma/optional/commerce/discounts.prisma"
        requirements={["Feature flag : commerce.discounts", "Capability : marketing.discountsRead"]}
        icon={Percent}
      />
    </AdminPageShell>
  );
}
