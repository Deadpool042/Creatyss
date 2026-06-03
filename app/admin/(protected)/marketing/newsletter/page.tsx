import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Mail } from "lucide-react";

export default function AdminMarketingNewsletterPage() {
  return (
    <AdminPageShell
      scrollMode="area"
      title="Newsletter"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing", href: "/admin/marketing/overview" }, { label: "Newsletter" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Newsletter"
        description="Gérez les abonnés, composez des campagnes email, suivez les taux d'ouverture et de clic. Segmentation par comportement d'achat."
        docRef="prisma/optional/engagement/newsletter.prisma"
        requirements={["Feature flag : engagement.newsletter", "Capability : marketing.newsletterRead"]}
        icon={Mail}
      />
    </AdminPageShell>
  );
}
