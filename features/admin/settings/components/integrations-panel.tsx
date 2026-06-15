import { Badge } from "@/components/ui/badge";
import type {
  AdminIntegrationCredentialSummary,
  AdminIntegrationSummary,
  AdminIntegrationSyncStateSummary,
  AdminIntegrationsSnapshot,
} from "@/features/admin/settings/queries/get-admin-integrations-snapshot.query";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value ? dateTimeFormatter.format(value) : "—";
}

function getIntegrationStatusLabel(status: AdminIntegrationSummary["status"]): string {
  switch (status) {
    case "ACTIVE":
      return "Actif";
    case "INACTIVE":
      return "Inactif";
    case "FAILED":
      return "En echec";
    case "ARCHIVED":
      return "Archive";
    case "DRAFT":
    default:
      return "Brouillon";
  }
}

function getIntegrationStatusVariant(
  status: AdminIntegrationSummary["status"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "FAILED":
      return "destructive";
    default:
      return "outline";
  }
}

function getCredentialStatusVariant(
  status: AdminIntegrationCredentialSummary["status"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "EXPIRED":
    case "REVOKED":
      return "destructive";
    default:
      return "outline";
  }
}

function getSyncStatusVariant(
  status: AdminIntegrationSyncStateSummary["status"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "SUCCEEDED":
      return "secondary";
    case "FAILED":
    case "CANCELLED":
      return "destructive";
    default:
      return "outline";
  }
}

function getIntegrationTypeLabel(type: AdminIntegrationSummary["type"]): string {
  switch (type) {
    case "PAYMENT_PROVIDER":
      return "Paiement";
    case "SHIPPING_PROVIDER":
      return "Transport";
    case "EMAIL_PROVIDER":
      return "Email";
    case "SOCIAL_PROVIDER":
      return "Social";
    case "ERP":
      return "ERP";
    case "CRM":
      return "CRM";
    case "MARKETPLACE":
      return "Marketplace";
    case "STORAGE":
      return "Stockage";
    case "OTHER":
    default:
      return "Autre";
  }
}

function OverviewCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-surface-border/60 bg-surface-subtle/20 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function IntegrationRow({ integration }: { integration: AdminIntegrationSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{integration.name}</span>
        <Badge variant={getIntegrationStatusVariant(integration.status)}>
          {getIntegrationStatusLabel(integration.status)}
        </Badge>
        <Badge variant="outline">{getIntegrationTypeLabel(integration.type)}</Badge>
        <Badge variant={integration.isEnabled ? "secondary" : "outline"}>
          {integration.isEnabled ? "Enabled" : "Disabled"}
        </Badge>
        <Badge variant="outline">{integration.isSandbox ? "Sandbox" : "Production"}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Code : {integration.code}</span>
        <span>Provider : {integration.provider}</span>
        <span>Maj : {formatDateTime(integration.updatedAt)}</span>
        <span>Credentials : {integration.credentialsCount}</span>
        <span>Sync states : {integration.syncStatesCount}</span>
      </div>
      {integration.description ? (
        <p className="text-sm leading-6 text-muted-foreground">{integration.description}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Base URL : {integration.baseUrl ?? "—"}</span>
        <span>Webhook base URL : {integration.webhookBaseUrl ?? "—"}</span>
        <span>Last check : {formatDateTime(integration.lastCheckedAt)}</span>
        <span>Activation : {formatDateTime(integration.activatedAt)}</span>
        <span>Echec : {formatDateTime(integration.failedAt)}</span>
      </div>
    </div>
  );
}

function CredentialRow({ credential }: { credential: AdminIntegrationCredentialSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{credential.key}</span>
        <Badge variant={getCredentialStatusVariant(credential.status)}>{credential.status}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Integration : {credential.integrationCode}</span>
        <span>Secret prefix : {credential.secretPrefix ?? "—"}</span>
        <span>Hint : {credential.valueHint ?? "—"}</span>
        <span>Maj : {formatDateTime(credential.updatedAt)}</span>
        <span>Expiration : {formatDateTime(credential.expiresAt)}</span>
        <span>Dernier usage : {formatDateTime(credential.lastUsedAt)}</span>
      </div>
    </div>
  );
}

function SyncStateRow({ state }: { state: AdminIntegrationSyncStateSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{state.scopeType}</span>
        <Badge variant={getSyncStatusVariant(state.status)}>{state.status}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Integration : {state.integrationCode}</span>
        <span>Scope ID : {state.scopeId ?? "—"}</span>
        <span>Job : {state.lastJobId ?? "—"}</span>
        <span>Maj : {formatDateTime(state.updatedAt)}</span>
        <span>Dernier run : {formatDateTime(state.lastRunAt)}</span>
        <span>Succes : {formatDateTime(state.lastSuccessAt)}</span>
        <span>Echec : {formatDateTime(state.lastFailureAt)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>External ref : {state.externalReference ?? "—"}</span>
        <span>Error code : {state.errorCode ?? "—"}</span>
      </div>
    </div>
  );
}

type IntegrationsPanelProps = {
  snapshot: AdminIntegrationsSnapshot;
};

export function IntegrationsPanel({ snapshot }: IntegrationsPanelProps) {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          Module optionnel
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Integrations externes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lecture admin du referentiel <code>Integration</code>, des credentials redacts
          et des etats de synchronisation. Aucun secret brut, aucun provider SDK et aucune
          action de reprise ne sont ajoutes dans ce lot.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <OverviewCard label="Integrations" value={snapshot.overview.totalIntegrations} hint="Entrees non archivees" />
          <OverviewCard label="Actives" value={snapshot.overview.activeIntegrations} hint="Statut ACTIVE" />
          <OverviewCard label="Enabled" value={snapshot.overview.enabledIntegrations} hint="Flag metier actif" />
          <OverviewCard label="Credentials" value={snapshot.overview.credentials} hint="Metadonnees redacées" />
          <OverviewCard label="Sync states" value={snapshot.overview.syncStates} hint="Etats connus" />
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Integrations</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.integrations.length > 0 ? (
            snapshot.integrations.map((integration) => (
              <IntegrationRow key={integration.id} integration={integration} />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucune integration n&apos;est presente en base pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Credentials recentes</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.credentials.length > 0 ? (
            snapshot.credentials.map((credential) => (
              <CredentialRow key={credential.id} credential={credential} />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucune metadata de credential en base pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Sync states recents</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.syncStates.length > 0 ? (
            snapshot.syncStates.map((state) => <SyncStateRow key={state.id} state={state} />)
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun etat de synchronisation en base pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
