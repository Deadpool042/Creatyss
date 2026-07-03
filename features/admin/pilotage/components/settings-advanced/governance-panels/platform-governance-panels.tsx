import {
  getIntegrationsGovernanceData,
  getLocalizationGovernanceData,
  getNotificationsGovernanceData,
  getWebhooksGovernanceData,
} from "@/features/admin/pilotage/queries/get-platform-governance-data.query";

import {
  GovernanceDefaultItem,
  GovernanceDomainContext,
  GovernanceEmptyState,
  GovernancePanelShell,
  GovernanceStatGrid,
  makeStat,
  type GovernanceStatItem,
} from "../governance-panel-primitives";

export async function NotificationsGovernancePanel() {
  const data = await getNotificationsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Notifications", value: data.total },
    { label: "7 derniers j", value: data.recent },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Notifications">
      <GovernanceDomainContext>
        Ce flag gouverne le{" "}
        <span className="font-medium text-foreground">canal de notification</span> interne.
        Lecture admin des entrées <code className="font-mono text-[10px]">Notification</code> et
        préférences destinataires. Aucun moteur d'émission externe dans cette version.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucune notification enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function IntegrationsGovernancePanel() {
  const data = await getIntegrationsGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Intégrations", value: data.total },
    { label: "États de sync", value: data.syncStates },
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Intégrations">
      <GovernanceDomainContext>
        Ce flag gouverne la couche d'
        <span className="font-medium text-foreground">intégrations tierces</span> — credentials
        redactés, états de synchronisation. Aucun adaptateur provider ni action opératoire dans
        cette version.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <GovernanceStatGrid stats={stats} columns={2} />
      ) : (
        <GovernanceEmptyState message="Aucune intégration enregistrée." />
      )}
    </GovernancePanelShell>
  );
}

export async function WebhooksGovernancePanel() {
  const data = await getWebhooksGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Endpoints", value: data.totalEndpoints },
    { label: "Livraisons", value: data.totalDeliveries },
    makeStat(
      "Échouées",
      data.failedDeliveries,
      data.failedDeliveries > 0 ? "text-feedback-error-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Webhooks">
      <GovernanceDomainContext>
        Ce flag gouverne les{" "}
        <span className="font-medium text-foreground">webhooks sortants</span> (endpoints,
        historique de livraison). Le niveau <code className="font-mono text-[10px]">read</code>{" "}
        ouvre la lecture, <code className="font-mono text-[10px]">manage</code> autorise la
        gestion des endpoints, et <code className="font-mono text-[10px]">retry</code> autorise
        la relance manuelle des deliveries. La sémantique entrante reste à clarifier.
      </GovernanceDomainContext>
      {data.totalEndpoints > 0 ? (
        <GovernanceStatGrid stats={stats} />
      ) : (
        <GovernanceEmptyState message="Aucun endpoint webhook enregistré." />
      )}
    </GovernancePanelShell>
  );
}

export async function LocalizationGovernancePanel() {
  const data = await getLocalizationGovernanceData();

  if (data === null) {
    return null;
  }

  const stats: GovernanceStatItem[] = [
    { label: "Locales", value: data.total },
    makeStat(
      "Actives",
      data.active,
      data.active > 0 ? "text-feedback-success-foreground" : undefined
    ),
  ];

  return (
    <GovernancePanelShell label="Gouvernance · Localisation">
      <GovernanceDomainContext>
        Ce flag gouverne le{" "}
        <span className="font-medium text-foreground">routing multilingue</span> et les
        traductions storefront. Niveau <code className="font-mono text-[10px]">managed</code> :
        rewrite Edge, hreflang et sitemap localisé. Traductions des pages gérées par locale
        active.
      </GovernanceDomainContext>
      {data.total > 0 ? (
        <div className="space-y-2">
          <GovernanceStatGrid stats={stats} columns={2} />
          {data.defaultLocale !== null ? (
            <GovernanceDefaultItem
              name={data.defaultLocale.code}
              secondary={data.defaultLocale.languageCode}
            />
          ) : null}
        </div>
      ) : (
        <GovernanceEmptyState message="Aucune locale enregistrée." />
      )}
    </GovernancePanelShell>
  );
}
