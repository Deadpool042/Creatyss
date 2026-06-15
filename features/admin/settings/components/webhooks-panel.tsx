import { Badge } from "@/components/ui/badge";
import type {
  AdminWebhookDeliverySummary,
  AdminWebhookEndpointSummary,
  AdminWebhooksSnapshot,
} from "@/features/admin/settings/queries/get-admin-webhooks-snapshot.query";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value ? dateTimeFormatter.format(value) : "—";
}

function getEndpointStatusVariant(
  status: AdminWebhookEndpointSummary["status"]
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

function getDeliveryStatusVariant(
  status: AdminWebhookDeliverySummary["status"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "SUCCEEDED":
      return "secondary";
    case "FAILED":
    case "CANCELLED":
    case "EXPIRED":
      return "destructive";
    default:
      return "outline";
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

function EndpointRow({ endpoint }: { endpoint: AdminWebhookEndpointSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{endpoint.name}</span>
        <Badge variant={getEndpointStatusVariant(endpoint.status)}>{endpoint.status}</Badge>
        <Badge variant={endpoint.isEnabled ? "secondary" : "outline"}>
          {endpoint.isEnabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Code : {endpoint.code}</span>
        <span>Event type : {endpoint.eventType}</span>
        <span>Integration : {endpoint.integrationCode ?? "—"}</span>
        <span>Deliveries : {endpoint.deliveriesCount}</span>
        <span>Maj : {formatDateTime(endpoint.updatedAt)}</span>
      </div>
      {endpoint.description ? (
        <p className="text-sm leading-6 text-muted-foreground">{endpoint.description}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Target URL : {endpoint.targetUrl}</span>
        <span>Secret prefix : {endpoint.secretPrefix ?? "—"}</span>
        <span>Version : {endpoint.version ?? "—"}</span>
        <span>Timeout : {endpoint.timeoutMs ?? "—"} ms</span>
        <span>Max attempts : {endpoint.maxAttempts}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Last trigger : {formatDateTime(endpoint.lastTriggeredAt)}</span>
        <span>Last success : {formatDateTime(endpoint.lastSucceededAt)}</span>
        <span>Last failure : {formatDateTime(endpoint.lastFailedAt)}</span>
      </div>
    </div>
  );
}

function DeliveryRow({ delivery }: { delivery: AdminWebhookDeliverySummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{delivery.eventType}</span>
        <Badge variant={getDeliveryStatusVariant(delivery.status)}>{delivery.status}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Endpoint : {delivery.endpointCode}</span>
        <span>Event ID : {delivery.eventId ?? "—"}</span>
        <span>Idempotency : {delivery.idempotencyKey ?? "—"}</span>
        <span>Attempts : {delivery.attemptCount}</span>
        <span>Maj : {formatDateTime(delivery.updatedAt)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Request : {delivery.requestMethod} {delivery.requestUrl}</span>
        <span>Response : {delivery.responseStatusCode ?? "—"}</span>
        <span>Scheduled : {formatDateTime(delivery.scheduledAt)}</span>
        <span>Started : {formatDateTime(delivery.startedAt)}</span>
        <span>Finished : {formatDateTime(delivery.finishedAt)}</span>
        <span>Error : {delivery.errorCode ?? "—"}</span>
      </div>
    </div>
  );
}

type WebhooksPanelProps = {
  snapshot: AdminWebhooksSnapshot;
};

export function WebhooksPanel({ snapshot }: WebhooksPanelProps) {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          Module optionnel
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Webhooks
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lecture admin du modele reel actuellement present : <code>WebhookEndpoint</code> et{" "}
          <code>WebhookDelivery</code>. Ce lot n&apos;essaie pas de masquer l&apos;ecart entre
          doctrine `webhooks entrants` et referentiel Prisma actuel oriente endpoints/deliveries.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <OverviewCard label="Endpoints" value={snapshot.overview.totalEndpoints} hint="Endpoints non archives" />
          <OverviewCard label="Actifs" value={snapshot.overview.activeEndpoints} hint="Statut ACTIVE" />
          <OverviewCard label="Enabled" value={snapshot.overview.enabledEndpoints} hint="Flag metier actif" />
          <OverviewCard label="Deliveries" value={snapshot.overview.deliveries} hint="Journal de deliveries" />
          <OverviewCard label="Echecs" value={snapshot.overview.failedDeliveries} hint="Deliveries FAILED" />
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Endpoints</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.endpoints.length > 0 ? (
            snapshot.endpoints.map((endpoint) => <EndpointRow key={endpoint.id} endpoint={endpoint} />)
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun endpoint webhook n&apos;est present en base pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Deliveries recentes</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.deliveries.length > 0 ? (
            snapshot.deliveries.map((delivery) => <DeliveryRow key={delivery.id} delivery={delivery} />)
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucune delivery webhook n&apos;est presente en base pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
