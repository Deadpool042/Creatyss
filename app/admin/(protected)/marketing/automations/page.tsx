import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminComingSoon } from "@/components/admin/shared/admin-coming-soon";
import { Zap } from "lucide-react";

export default function AdminMarketingAutomationsPage() {
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
        docRef="docs/domains/optional/"
        requirements={["Capability : marketing.automationsRead", "Modèle Automation à définir"]}
        icon={Zap}
        fallbackAction={{ label: "Voir les codes promo", href: "/admin/marketing/discounts" }}
      />
    </AdminPageShell>
  );
}
