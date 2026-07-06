import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  GitBranch,
  Info,
  Package,
  Shield,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import type {
  AdminAuditLogEntry,
  AdminSystemHealth,
} from "@/features/admin/maintenance/queries/get-admin-system-health.query";

type ServiceStatus = "ok" | "warn" | "error" | "unknown";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const LEVEL_CONFIG: Record<
  AdminAuditLogEntry["level"],
  { icon: React.ComponentType<{ className?: string }>; badge: string; label: string }
> = {
  INFO: { icon: Info, badge: "bg-surface-subtle text-muted-foreground", label: "Info" },
  WARNING: {
    icon: AlertTriangle,
    badge: "bg-feedback-warning-surface/75 text-feedback-warning-foreground",
    label: "Alerte",
  },
  CRITICAL: {
    icon: AlertTriangle,
    badge: "bg-feedback-error-surface/75 text-feedback-error-foreground",
    label: "Critique",
  },
};

function ServiceRow({
  label,
  status,
  detail,
  icon: Icon,
}: {
  label: string;
  status: ServiceStatus;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const StatusIcon = status === "ok" ? CheckCircle2 : status === "error" ? AlertTriangle : Clock;
  const statusClass =
    status === "ok"
      ? "text-feedback-success-foreground"
      : status === "error"
        ? "text-feedback-error-foreground"
        : status === "warn"
          ? "text-feedback-warning-foreground"
          : "text-muted-foreground/50";

  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-subtle">
        <Icon className="size-4 text-muted-foreground/60" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <StatusIcon className={cn("size-4 shrink-0", statusClass)} />
    </div>
  );
}

type MaintenanceOverviewSectionsProps = Readonly<{
  health: AdminSystemHealth;
  dbOk: boolean;
}>;

export function MaintenanceOverviewSections({ health, dbOk }: MaintenanceOverviewSectionsProps) {
  const stats = [
    { label: "Jobs en attente", value: health.jobs.pending },
    { label: "Jobs échoués", value: health.jobs.failed, alert: true },
    { label: "Events échoués", value: health.events.failed, alert: true },
    { label: "Audit critiques", value: health.audit.critical, alert: true },
  ];

  const services: ReadonlyArray<{
    label: string;
    status: ServiceStatus;
    detail: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      label: "Base de données",
      status: dbOk ? "ok" : "error",
      detail: dbOk ? "PostgreSQL — connexion active" : "Connexion échouée",
      icon: Database,
    },
    {
      label: "File de jobs",
      status:
        health.jobs.failed > 0
          ? "error"
          : health.jobs.running > 0 || health.jobs.pending > 0
            ? "warn"
            : "ok",
      detail: `${health.jobs.pending} en attente · ${health.jobs.running} en cours · ${health.jobs.failed} échoués`,
      icon: Zap,
    },
    {
      label: "Événements domaine",
      status: health.events.failed > 0 ? "error" : health.events.pending > 10 ? "warn" : "ok",
      detail: `${health.events.total} total · ${health.events.pending} en attente · ${health.events.failed} échoués`,
      icon: GitBranch,
    },
    {
      label: "Audit",
      status: health.audit.critical > 0 ? "error" : health.audit.warning > 0 ? "warn" : "ok",
      detail: `${health.audit.total} entrées · ${health.audit.critical} critique${health.audit.critical !== 1 ? "s" : ""} · ${health.audit.warning} alerte${health.audit.warning !== 1 ? "s" : ""}`,
      icon: Package,
    },
  ];

  const overallStatus: ServiceStatus = services.some((s) => s.status === "error")
    ? "error"
    : services.some((s) => s.status === "warn")
      ? "warn"
      : "ok";

  const overallLabel =
    overallStatus === "ok"
      ? "Tous les services opérationnels"
      : overallStatus === "error"
        ? "Intervention requise"
        : "Alertes détectées";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={cn(
              "rounded-2xl border border-surface-border/60 px-4 py-3 shadow-sm backdrop-blur-sm",
              s.alert && s.value > 0
                ? "bg-feedback-error-surface/30 border-feedback-error-border"
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

      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-sm backdrop-blur-sm",
          overallStatus === "ok"
            ? "border-feedback-success-border bg-feedback-success-surface/20"
            : overallStatus === "error"
              ? "border-feedback-error-border bg-feedback-error-surface/20"
              : "border-feedback-warning-border bg-feedback-warning-surface/20"
        )}
      >
        {overallStatus === "ok" ? (
          <CheckCircle2 className="size-6 shrink-0 text-feedback-success-foreground" />
        ) : overallStatus === "error" ? (
          <AlertTriangle className="size-6 shrink-0 text-feedback-error-foreground" />
        ) : (
          <Clock className="size-6 shrink-0 text-feedback-warning-foreground" />
        )}
        <div>
          <p className="text-sm font-semibold text-foreground">{overallLabel}</p>
          <p className="text-xs text-muted-foreground">Dernière vérification : maintenant</p>
        </div>
      </div>

      <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Services
        </p>
        <div className="divide-y divide-surface-border/30">
          {services.map((s) => (
            <ServiceRow key={s.label} {...s} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Shield className="size-4 text-muted-foreground/60" />
          <h2 className="text-sm font-semibold text-foreground">Journal d'audit</h2>
          <span className="text-xs text-muted-foreground/60">(50 dernières entrées)</span>
        </div>

        {health.audit.recent.length === 0 ? (
          <AdminEmptyState
            eyebrow="Audit"
            title="Aucune entrée d'audit"
            description="Aucune action n'a encore été journalisée."
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/50">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 border-b border-surface-border/40 px-4 py-2.5">
              {["Niveau", "Action / Entité", "Acteur", "Date"].map((h) => (
                <p
                  key={h}
                  className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60"
                >
                  {h}
                </p>
              ))}
            </div>
            <div className="divide-y divide-surface-border/30 max-h-[32rem] overflow-y-auto">
              {health.audit.recent.map((log) => {
                const cfg = LEVEL_CONFIG[log.level];
                const LevelIcon = cfg.icon;
                return (
                  <div
                    key={log.id}
                    className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-surface-subtle/20"
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap",
                        cfg.badge
                      )}
                    >
                      <LevelIcon className="size-2.5" />
                      {cfg.label}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate font-mono text-[12px] text-foreground">
                        {log.actionCode}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60">
                        {log.entityType}
                        {log.entityId ? ` · ${log.entityId.slice(-8)}` : ""}
                        {log.message ? ` — ${log.message}` : ""}
                      </p>
                    </div>

                    <span className="shrink-0 text-[11px] text-muted-foreground/60">
                      {log.actorType === "SYSTEM"
                        ? "System"
                        : (log.actorUserId?.slice(-8) ?? log.actorType)}
                    </span>

                    <span className="shrink-0 text-[11px] text-muted-foreground/60">
                      {dateFormatter.format(new Date(log.createdAt))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
