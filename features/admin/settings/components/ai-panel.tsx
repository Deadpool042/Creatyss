import { Badge } from "@/components/ui/badge";
import type {
  AdminAiProviderSummary,
  AdminAiSnapshot,
  AdminAiTaskSummary,
} from "@/features/admin/settings/queries/get-admin-ai-snapshot.query";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: Date | null): string {
  return value ? dateTimeFormatter.format(value) : "—";
}

function getProviderStatusVariant(
  status: AdminAiProviderSummary["status"]
): "secondary" | "outline" | "destructive" {
  switch (status) {
    case "ACTIVE":
      return "secondary";
    case "ARCHIVED":
      return "destructive";
    default:
      return "outline";
  }
}

function getTaskStatusVariant(
  status: AdminAiTaskSummary["status"]
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

function getTaskTypeLabel(type: AdminAiTaskSummary["type"]): string {
  switch (type) {
    case "TEXT_GENERATION":
      return "Generation texte";
    case "TEXT_SUMMARIZATION":
      return "Resume";
    case "SEO_SUGGESTION":
      return "Suggestion SEO";
    case "PRODUCT_ENRICHMENT":
      return "Enrichissement produit";
    case "CONTENT_ASSIST":
      return "Assistance contenu";
    case "CLASSIFICATION":
      return "Classification";
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

function ProviderRow({ provider }: { provider: AdminAiProviderSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">{provider.name}</span>
        <Badge variant={getProviderStatusVariant(provider.status)}>{provider.status}</Badge>
        <Badge variant={provider.isEnabled ? "secondary" : "outline"}>
          {provider.isEnabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Code : {provider.code}</span>
        <span>Provider : {provider.provider}</span>
        <span>Modele : {provider.modelCode ?? "—"}</span>
        <span>Taches : {provider.tasksCount}</span>
        <span>Maj : {formatDateTime(provider.updatedAt)}</span>
      </div>
      {provider.description ? (
        <p className="text-sm leading-6 text-muted-foreground">{provider.description}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Derniere tache : {formatDateTime(provider.lastTaskAt)}</span>
        <span>Activation : {formatDateTime(provider.activatedAt)}</span>
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: AdminAiTaskSummary }) {
  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-foreground">
          {getTaskTypeLabel(task.type)}
        </span>
        <Badge variant={getTaskStatusVariant(task.status)}>{task.status}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Provider : {task.providerCode ?? "—"}</span>
        <span>Sujet : {task.subjectType ?? "—"}</span>
        <span>Subject ID : {task.subjectId ?? "—"}</span>
        <span>Demandeur : {task.requestedByEmail ?? "—"}</span>
        <span>Maj : {formatDateTime(task.updatedAt)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Input texte : {task.hasInputText ? "oui" : "non"}</span>
        <span>Output texte : {task.hasOutputText ? "oui" : "non"}</span>
        <span>Erreur : {task.errorCode ?? "—"}</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>Demarre : {formatDateTime(task.startedAt)}</span>
        <span>Termine : {formatDateTime(task.finishedAt)}</span>
        <span>Expire : {formatDateTime(task.expiresAt)}</span>
      </div>
    </div>
  );
}

type AiPanelProps = {
  snapshot: AdminAiSnapshot;
};

export function AiPanel({ snapshot }: AiPanelProps) {
  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
          Module optionnel
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Assistance IA
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lecture admin du modele reel <code>AiProvider</code> / <code>AiTask</code>.
          Le premier usage borne est maintenant la suggestion SEO manuelle sur
          fiche produit, mais aucun provider SDK ni workflow d&apos;acceptation
          transverse n&apos;est encore ouvert.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <OverviewCard label="Providers" value={snapshot.overview.totalProviders} hint="Entrees non archivees" />
          <OverviewCard label="Actifs" value={snapshot.overview.activeProviders} hint="Statut ACTIVE" />
          <OverviewCard label="Enabled" value={snapshot.overview.enabledProviders} hint="Flag provider actif" />
          <OverviewCard label="Taches" value={snapshot.overview.tasks} hint="Taches non archivees" />
          <OverviewCard label="Echecs" value={snapshot.overview.failedTasks} hint="Taches FAILED" />
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Providers IA</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.providers.length > 0 ? (
            snapshot.providers.map((provider) => (
              <ProviderRow key={provider.id} provider={provider} />
            ))
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun provider IA n&apos;est present en base pour le moment.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Taches recentes</h2>
        <div className="mt-4 divide-y divide-surface-border/40">
          {snapshot.tasks.length > 0 ? (
            snapshot.tasks.map((task) => <TaskRow key={task.id} task={task} />)
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucune tache IA n&apos;est presente en base pour le moment.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
