import {
  getAnalyticsGovernanceData,
  getAutomationsGovernanceData,
  getNewsletterGovernanceData,
} from "@/features/admin/pilotage/queries/get-engagement-governance-data.query";

import {
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  makeStat,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function NewsletterGovernancePanel() {
  const data = await getNewsletterGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Abonnés", value: data.total },
    makeStat(
      "Actifs",
      data.subscribed,
      data.subscribed > 0 ? "text-feedback-success-foreground" : undefined
    ),
    { label: "Désabonnés", value: data.unsubscribed },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Newsletter">
      <GovernanceDomainContext>
        Ce flag gouverne la{" "}
        <span className="font-medium text-foreground">liste de diffusion</span>. Le niveau{" "}
        <code className="font-mono text-[10px]">segmentation</code> active les filtres par source
        et statut. Le niveau <code className="font-mono text-[10px]">automation</code> branche la
        souscription storefront sur le moteur d'automatisations.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucun abonné enregistré." />
      )}
    </GovernancePanelShell>
  );
}

export async function AutomationsGovernancePanel() {
  const data = await getAutomationsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Définitions", value: data.totalDefs },
    makeStat(
      "Actives",
      data.activeDefs,
      data.activeDefs > 0 ? "text-feedback-success-foreground" : undefined
    ),
    makeStat(
      "Jobs échoués",
      data.failedJobs,
      data.failedJobs > 0 ? "text-feedback-error-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Automatisations">
      <GovernanceDomainContext>
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">définitions d'automation</span> et leur
        exécution via le moteur de jobs. Boucle d'exécution bornée — sans worker générique ni run
        model externe.
      </GovernanceDomainContext>
      {data.totalDefs > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucune automation enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function AnalyticsGovernancePanel() {
  const data = await getAnalyticsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Commandes", value: data.totalOrders },
    { label: "Clients", value: data.totalCustomers },
    makeStat(
      "30 derniers j",
      data.recentOrders,
      data.recentOrders > 0 ? "text-feedback-success-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Analytics">
      <GovernanceDomainContext>
        Ce flag gouverne l'accès aux{" "}
        <span className="font-medium text-foreground">données analytiques commerce</span>. Le
        niveau <code className="font-mono text-[10px]">insights</code> active les indicateurs
        avancés (panier moyen, top produits). Le tracking comportemental reste hors périmètre.
      </GovernanceDomainContext>
      <GovernanceStatGrid stats={stats} />
    </GovernancePanelShell>
  );
}
