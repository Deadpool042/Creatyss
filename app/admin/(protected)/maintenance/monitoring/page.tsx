import { AlertTriangle, CheckCircle2, Clock, Database, GitBranch, Package, Zap } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { cn } from "@/lib/utils";
import { getAdminSystemHealth } from "@/features/admin/maintenance/queries/get-admin-system-health.query";

export const dynamic = "force-dynamic";

type ServiceStatus = "ok" | "warn" | "error" | "unknown";

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

export default async function AdminMaintenanceMonitoringPage() {
  let health: Awaited<ReturnType<typeof getAdminSystemHealth>> | null = null;
  let dbOk = true;

  try {
    health = await getAdminSystemHealth();
  } catch {
    dbOk = false;
  }

  // Determine service statuses
  const services = [
    {
      label: "Base de données",
      status: !dbOk ? "error" : ("ok" as ServiceStatus),
      detail: dbOk ? "PostgreSQL — connexion active" : "Connexion échouée",
      icon: Database,
    },
    {
      label: "File de jobs",
      status: !health
        ? "unknown"
        : health.jobs.failed > 0
          ? "error"
          : health.jobs.running > 0 || health.jobs.pending > 0
            ? "warn"
            : ("ok" as ServiceStatus),
      detail: !health
        ? "Données indisponibles"
        : `${health.jobs.pending} en attente · ${health.jobs.running} en cours · ${health.jobs.failed} échoués`,
      icon: Zap,
    },
    {
      label: "Événements domaine",
      status: !health
        ? "unknown"
        : health.events.failed > 0
          ? "error"
          : health.events.pending > 10
            ? "warn"
            : ("ok" as ServiceStatus),
      detail: !health
        ? "Données indisponibles"
        : `${health.events.total} total · ${health.events.pending} en attente · ${health.events.failed} échoués`,
      icon: GitBranch,
    },
    {
      label: "Audit",
      status: !health
        ? "unknown"
        : health.audit.critical > 0
          ? "error"
          : health.audit.warning > 0
            ? "warn"
            : ("ok" as ServiceStatus),
      detail: !health
        ? "Données indisponibles"
        : `${health.audit.total} entrées · ${health.audit.critical} critique${health.audit.critical !== 1 ? "s" : ""} · ${health.audit.warning} alerte${health.audit.warning !== 1 ? "s" : ""}`,
      icon: Package,
    },
  ];

  const overallStatus: ServiceStatus =
    services.some((s) => s.status === "error")
      ? "error"
      : services.some((s) => s.status === "warn")
        ? "warn"
        : services.every((s) => s.status === "ok")
          ? "ok"
          : "unknown";

  const overallLabel =
    overallStatus === "ok"
      ? "Tous les services opérationnels"
      : overallStatus === "error"
        ? "Intervention requise"
        : overallStatus === "warn"
          ? "Alertes détectées"
          : "État inconnu";

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Monitoring"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Maintenance" },
        { label: "Monitoring" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="table"
    >
      {/* État global */}
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-sm backdrop-blur-sm",
          overallStatus === "ok"
            ? "border-feedback-success-border bg-feedback-success-surface/20"
            : overallStatus === "error"
              ? "border-feedback-error-border bg-feedback-error-surface/20"
              : overallStatus === "warn"
                ? "border-feedback-warning-border bg-feedback-warning-surface/20"
                : "border-surface-border/60 bg-surface-panel/60"
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
          <p className="text-xs text-muted-foreground">
            Dernière vérification : maintenant
          </p>
        </div>
      </div>

      {/* Services */}
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

      {/* Quick links */}
      <div className="flex flex-wrap gap-2">
        <a
          href="/admin/maintenance/logs"
          className="inline-flex items-center gap-1.5 rounded-full border border-surface-border/60 bg-surface-panel px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-panel-soft hover:text-foreground"
        >
          <Zap className="size-3.5" />
          Jobs queue
        </a>
        <a
          href="/admin/maintenance/observability"
          className="inline-flex items-center gap-1.5 rounded-full border border-surface-border/60 bg-surface-panel px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-panel-soft hover:text-foreground"
        >
          <Package className="size-3.5" />
          Journal d'audit
        </a>
      </div>
    </AdminPageShell>
  );
}
