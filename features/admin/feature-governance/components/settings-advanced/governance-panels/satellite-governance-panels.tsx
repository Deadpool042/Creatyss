import {
  getChannelsGovernanceData,
  getSearchGovernanceData,
} from "@/features/admin/feature-governance/queries/get-satellite-governance-data.query";

import {
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function SearchGovernancePanel() {
  const data = await getSearchGovernanceData();

  if (data === null) {
    return null;
  }

  return (
    <GovernancePanelShell label="Gouvernance · Recherche">
      <GovernanceDomainContext>
        Ce flag gouverne l'
        <span className="font-medium text-foreground">index de recherche</span> — documents
        indexés, compteurs d'entrées. Aucun moteur externe ni indexation automatique dans cette
        version.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid
          stats={[{ label: "Documents indexés", value: data.total }]}
          columns={2}
        />
      ) : (
        <GovernanceEmptyState message="Aucun document indexé." />
      )}
    </GovernancePanelShell>
  );
}

export async function ChannelsGovernancePanel() {
  const data = await getChannelsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Canaux", value: data.totalChannels },
    { label: "Produits publiés", value: data.totalProductStatuses },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Canaux">
      <GovernanceDomainContext>
        Ce flag gouverne la publication sur des{" "}
        <span className="font-medium text-foreground">canaux de vente tiers</span> (marketplaces,
        réseaux sociaux). Aucun provider externe ni synchronisation automatique dans cette
        version.
      </GovernanceDomainContext>
      {data.totalChannels > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucun canal enregistré." />
      )}
    </GovernancePanelShell>
  );
}
