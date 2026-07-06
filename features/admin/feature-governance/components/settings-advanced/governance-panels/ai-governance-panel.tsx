import { getAiGovernanceData } from "@/features/admin/feature-governance/queries/get-ai-governance-data.query";

import {
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  makeStat,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function AiGovernancePanel() {
  const data = await getAiGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Tâches IA", value: data.total },
    makeStat(
      "Réussies",
      data.succeeded,
      data.succeeded > 0 ? "text-feedback-success-foreground" : undefined
    ),
    makeStat(
      "Échouées",
      data.failed,
      data.failed > 0 ? "text-feedback-error-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · IA">
      <GovernanceDomainContext>
        Ce flag gouverne les <span className="font-medium text-foreground">usages IA</span>{" "}
        (suggestions SEO produit et blog, tracés dans{" "}
        <code className="font-mono text-[10px]">AiTask</code>). Niveau{" "}
        <code className="font-mono text-[10px]">automation</code> : première suggestion préparée
        automatiquement. Aucun provider SDK externe câblé.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune tâche IA enregistrée." />
      )}
    </GovernancePanelShell>
  );
}
