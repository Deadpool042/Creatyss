import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { AdminNewsletterAutomationSnapshot } from "@/features/admin/marketing/newsletter/queries/get-admin-newsletter-automation-snapshot.query";

type AdminNewsletterAutomationPanelProps = {
  snapshot: AdminNewsletterAutomationSnapshot;
};

export function AdminNewsletterAutomationPanel({
  snapshot,
}: AdminNewsletterAutomationPanelProps) {
  const bridgeActive =
    snapshot.newsletterAutomationLevelMet && snapshot.automationsFeatureActive;

  return (
    <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">Automation</h2>
          <p className="text-xs text-muted-foreground">
            Pont borné entre l&apos;inscription newsletter et les automations
            `NEWSLETTER_SUBSCRIBED`.
          </p>
        </div>
        <Badge variant={bridgeActive ? "secondary" : "outline"}>
          {bridgeActive ? "Pont actif" : "Pont inactif"}
        </Badge>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline">Automations actives {snapshot.activeAutomationCount}</Badge>
        <Badge variant="outline">Jobs en attente {snapshot.pendingJobCount}</Badge>
        <Badge variant="outline">Jobs prêts {snapshot.readyJobCount}</Badge>
        <Badge variant="outline">Jobs échoués {snapshot.failedJobCount}</Badge>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {snapshot.newsletterAutomationLevelMet
          ? snapshot.automationsFeatureActive
            ? "Les nouvelles inscriptions storefront peuvent maintenant planifier des jobs si une automation active correspond au déclencheur."
            : "Le niveau newsletter autorise l'automation, mais le module engagement.automations reste inactif : aucune planification n'est exécutée."
          : "Le niveau automation de la newsletter n'est pas actif : les inscriptions alimentent le référentiel, sans planification de jobs."}
      </p>

      <div className="mt-4">
        <Link
          href="/admin/marketing/automations"
          className="text-xs font-medium text-muted-foreground underline-offset-4 hover:underline"
        >
          Ouvrir le cockpit automations
        </Link>
      </div>
    </section>
  );
}
