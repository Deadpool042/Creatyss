import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { isNewsletterFeatureActive } from "@/features/admin/marketing/queries/is-newsletter-feature-active.query";
import { Mail } from "lucide-react";

export default async function AdminMarketingNewsletterPage() {
  const featureActive = await isNewsletterFeatureActive();
  if (!featureActive) notFound();
  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Newsletter"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing", href: "/admin/marketing/overview" }, { label: "Newsletter" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Newsletter"
        description="Gérez les abonnés, composez des campagnes email, suivez les taux d'ouverture et de clic. Segmentation par comportement d'achat."
        docRef="docs/domains/cross-cutting/newsletter.md"
        requirements={["Feature flag : engagement.newsletter", "Capability : marketing.newsletterRead"]}
        icon={Mail}
      />
    </AdminPageShell>
  );
}
