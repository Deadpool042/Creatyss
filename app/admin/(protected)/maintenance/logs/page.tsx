import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { MaintenanceRouteNav } from "@/features/admin/maintenance/components/maintenance-route-nav";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { cn } from "@/lib/utils";
import {
  listAdminJobs,
  type AdminJobSummary,
} from "@/features/admin/maintenance/queries/list-admin-jobs.query";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const STATUS_CONFIG: Record<
  AdminJobSummary["status"],
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
  }
> = {
  PENDING: { label: "En attente", icon: Clock, badge: "bg-surface-subtle text-muted-foreground" },
  RUNNING: { label: "En cours", icon: Loader2, badge: "bg-sky-50/80 text-sky-700" },
  SUCCEEDED: {
    label: "Réussi",
    icon: CheckCircle2,
    badge: "bg-feedback-success-surface/75 text-feedback-success-foreground",
  },
  FAILED: {
    label: "Échoué",
    icon: XCircle,
    badge: "bg-feedback-error-surface/75 text-feedback-error-foreground",
  },
  CANCELLED: {
    label: "Annulé",
    icon: AlertCircle,
    badge: "bg-surface-subtle text-muted-foreground/70",
  },
};

const PRIORITY_LABELS: Record<AdminJobSummary["priority"], string> = {
  LOW: "Basse",
  NORMAL: "Normale",
  HIGH: "Haute",
  CRITICAL: "Critique",
};

export default async function AdminMaintenanceLogsPage() {
  let result: Awaited<ReturnType<typeof listAdminJobs>> = {
    jobs: [],
    stats: { pending: 0, running: 0, failed: 0, succeeded: 0, cancelled: 0, total: 0 },
  };

  try {
    result = await listAdminJobs(100);
  } catch (error) {
    console.error("[maintenance/logs] listAdminJobs failed", error);
  }

  const { jobs, stats } = result;

  const heroStats = [
    { label: "Total", value: stats.total },
    { label: "En attente", value: stats.pending, warn: stats.pending > 10 },
    { label: "En cours", value: stats.running, warn: false },
    { label: "Échoués", value: stats.failed, alert: stats.failed > 0 },
  ];

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Logs"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Maintenance" },
        { label: "Jobs" },
      ]}
      showTitleInContent={false}
      contentPreset="table"
      header={
        <AdminPageHeader
          eyebrow="Maintenance"
          title="Jobs"
          description="Lecture opérationnelle des tâches en arrière-plan, priorités et statuts d'exécution."
        />
      }
    >
      <MaintenanceRouteNav />
      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {heroStats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border border-surface-border/60 px-4 py-3 shadow-sm backdrop-blur-sm",
              s.alert && s.value > 0
                ? "bg-feedback-error-surface/30 border-feedback-error-border"
                : s.warn && s.value > 0
                  ? "bg-feedback-warning-surface/30"
                  : "bg-surface-panel/60"
            )}
          >
            <p
              className={cn(
                "text-2xl font-semibold tracking-tight",
                s.alert && s.value > 0 ? "text-feedback-error-foreground" : "text-foreground"
              )}
            >
              {s.value}
            </p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Liste jobs */}
      {jobs.length === 0 ? (
        <AdminEmptyState
          eyebrow="Aucun job"
          title="File de jobs vide"
          description="Les tâches en arrière-plan (emails, exports, synchronisations) apparaîtront ici."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/50">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-surface-border/40 px-4 py-2.5">
            {["Job / Type", "Priorité", "Statut", "Date"].map((h) => (
              <p
                key={h}
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60"
              >
                {h}
              </p>
            ))}
          </div>

          <div className="divide-y divide-surface-border/30">
            {jobs.map((job) => {
              const cfg = STATUS_CONFIG[job.status];
              const StatusIcon = cfg.icon;
              const ts = job.finishedAt ?? job.startedAt ?? job.scheduledAt ?? job.createdAt;

              return (
                <div
                  key={job.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-4 py-3 hover:bg-surface-subtle/20 transition-colors"
                >
                  {/* Type */}
                  <div className="min-w-0">
                    <p className="truncate font-mono text-[12px] font-medium text-foreground">
                      {job.typeCode}
                    </p>
                    {job.errorMessage ? (
                      <p className="mt-0.5 truncate text-[11px] text-feedback-error-foreground">
                        {job.errorMessage}
                      </p>
                    ) : job.subjectType ? (
                      <p className="mt-0.5 text-[11px] text-muted-foreground/60">
                        {job.subjectType}
                        {job.subjectId ? ` · ${job.subjectId.slice(-8)}` : ""}
                      </p>
                    ) : null}
                  </div>

                  {/* Priorité */}
                  <span className="shrink-0 text-[11px] text-muted-foreground/60">
                    {PRIORITY_LABELS[job.priority]}
                  </span>

                  {/* Statut */}
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium",
                      cfg.badge
                    )}
                  >
                    <StatusIcon className="size-3 shrink-0" />
                    {cfg.label}
                  </span>

                  {/* Date */}
                  <span className="shrink-0 text-[11px] text-muted-foreground/60">
                    {dateFormatter.format(new Date(ts))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}
