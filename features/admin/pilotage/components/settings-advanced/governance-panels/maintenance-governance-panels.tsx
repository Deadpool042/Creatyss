import {
  getLogsGovernanceData,
  getObservabilityGovernanceData,
} from "@/features/admin/pilotage/queries/get-maintenance-governance-data.query";

import {
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function ObservabilityGovernancePanel() {
  const data = await getObservabilityGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Signaux", value: data.totalSignals },
    { label: "24 dernières h", value: data.recentSignals },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Observabilité">
      <GovernanceDomainContext>
        Ce flag gouverne la collecte de{" "}
        <span className="font-medium text-foreground">signaux d'observabilité</span> — métriques,
        alertes de santé. Accès admin via{" "}
        <code className="font-mono text-[10px]">/admin/maintenance/overview</code>.
      </GovernanceDomainContext>
      {data.totalSignals > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucun signal d'observabilité enregistré." />
      )}
    </GovernancePanelShell>
  );
}

export async function LogsGovernancePanel() {
  const data = await getLogsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Entrées", value: data.total },
    { label: "24 dernières h", value: data.recentLogs },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Logs">
      <GovernanceDomainContext>
        Ce flag gouverne l'accès admin aux{" "}
        <span className="font-medium text-foreground">journaux d'audit</span> — traçabilité des
        mutations critiques. Accès via{" "}
        <code className="font-mono text-[10px]">/admin/maintenance/logs</code>.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucune entrée de log." />
      )}
    </GovernancePanelShell>
  );
}
