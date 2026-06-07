import { notFound } from "next/navigation";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { isAutomationsFeatureActive } from "@/features/admin/marketing/queries/is-automations-feature-active.query";
import { Zap } from "lucide-react";

export default async function AdminMarketingAutomationsPage() {
  const featureActive = await isAutomationsFeatureActive();
  if (!featureActive) notFound();
  return (
    <AdminPageShell
      scrollMode="area"
      title="Automations"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Marketing", href: "/admin/marketing/overview" }, { label: "Automations" }]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
    >
      <AdminComingSoon
        title="Automations"
        description="Configurez des flux automatisés : email panier abandonné, relance post-achat, bienvenue abonné. Déclencheurs basés sur les événements boutique."
        requirements={["Feature flag : engagement.automations", "Schéma Prisma Automation à définir"]}
        icon={Zap}
        fallbackAction={{ label: "Voir les codes promo", href: "/admin/marketing/discounts" }}
      />
    </AdminPageShell>
  );
}
