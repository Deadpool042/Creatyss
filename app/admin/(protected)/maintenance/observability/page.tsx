import { AlertTriangle, CheckCircle2, Info, Shield } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { MaintenanceRouteNav } from "@/features/admin/maintenance/components/maintenance-route-nav";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { cn } from "@/lib/utils";
import { getAdminSystemHealth, type AdminAuditLogEntry } from "@/features/admin/maintenance/queries/get-admin-system-health.query";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const LEVEL_CONFIG: Record<AdminAuditLogEntry["level"], {
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  label: string;
}> = {
  INFO: { icon: Info, badge: "bg-surface-subtle text-muted-foreground", label: "Info" },
  WARNING: { icon: AlertTriangle, badge: "bg-feedback-warning-surface/75 text-feedback-warning-foreground", label: "Alerte" },
  CRITICAL: { icon: AlertTriangle, badge: "bg-feedback-error-surface/75 text-feedback-error-foreground", label: "Critique" },
};

export default async function AdminMaintenanceObservabilityPage() {
  let health: Awaited<ReturnType<typeof getAdminSystemHealth>> | null = null;

  try {
    health = await getAdminSystemHealth();
  } catch {
    // Tables non disponibles
  }

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Audit & Observabilité"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Maintenance" },
        { label: "Observabilité" },
      ]}
      showTitleInContent={false}
      contentPreset="detail"
      header={
        <AdminPageHeader
          eyebrow="Maintenance"
          title="Observabilité"
          description="Audit récent, événements techniques et alertes critiques de la plateforme."
        />
      }
    >
      <MaintenanceRouteNav />
      {!health ? (
        <AdminEmptyState
          eyebrow="Indisponible"
          title="Tables d'audit non accessibles"
          description="Les tables AuditLog et DomainEvent ne sont pas encore disponibles dans cette base."
        />
      ) : (
        <>
          {/* Health overview */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Logs audit",
                value: health.audit.total,
                alert: health.audit.critical > 0,
                hint: health.audit.critical > 0
                  ? `${health.audit.critical} critique${health.audit.critical > 1 ? "s" : ""}`
                  : health.audit.warning > 0
                    ? `${health.audit.warning} alerte${health.audit.warning > 1 ? "s" : ""}`
                    : "Aucune anomalie",
              },
              {
                label: "Événements",
                value: health.events.total,
                alert: health.events.failed > 0,
                hint: health.events.failed > 0
                  ? `${health.events.failed} échoué${health.events.failed > 1 ? "s" : ""}`
                  : `${health.events.pending} en attente`,
              },
              {
                label: "Jobs échoués",
                value: health.jobs.failed,
                alert: health.jobs.failed > 0,
                hint: health.jobs.failed > 0 ? "Intervention requise" : "File saine",
              },
              {
                label: "État général",
                value: health.audit.critical === 0 && health.jobs.failed === 0 && health.events.failed === 0 ? "✓" : "⚠",
                alert: health.audit.critical > 0 || health.jobs.failed > 0 || health.events.failed > 0,
                hint: "Alertes critiques",
              },
            ].map((s) => (
              <div
                key={s.label}
                className={cn(
                  "rounded-2xl border px-4 py-3 shadow-sm backdrop-blur-sm",
                  s.alert
                    ? "border-feedback-error-border bg-feedback-error-surface/20"
                    : "border-surface-border/60 bg-surface-panel/60"
                )}
              >
                <p className={cn("text-2xl font-semibold tracking-tight", s.alert ? "text-feedback-error-foreground" : "text-foreground")}>
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/60">{s.hint}</p>
              </div>
            ))}
          </div>

          {/* Audit log */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Shield className="size-4 text-muted-foreground/60" />
              <h2 className="text-sm font-semibold text-foreground">Journal d'audit</h2>
              <span className="text-xs text-muted-foreground/60">(50 dernières entrées)</span>
            </div>

            {health.audit.recent.length === 0 ? (
              <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/50 p-8 text-center">
                <CheckCircle2 className="mx-auto mb-2 size-6 text-feedback-success-foreground/40" />
                <p className="text-sm text-muted-foreground">Aucune entrée d'audit</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/50">
                {/* Header */}
                <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 border-b border-surface-border/40 px-4 py-2.5">
                  {["Niveau", "Action / Entité", "Acteur", "Date"].map((h) => (
                    <p key={h} className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">{h}</p>
                  ))}
                </div>
                <div className="divide-y divide-surface-border/30 max-h-[32rem] overflow-y-auto">
                  {health.audit.recent.map((log) => {
                    const cfg = LEVEL_CONFIG[log.level];
                    const LevelIcon = cfg.icon;
                    return (
                      <div key={log.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 px-4 py-2.5 hover:bg-surface-subtle/20 transition-colors">
                        {/* Level */}
                        <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap", cfg.badge)}>
                          <LevelIcon className="size-2.5" />
                          {cfg.label}
                        </span>

                        {/* Action */}
                        <div className="min-w-0">
                          <p className="truncate font-mono text-[12px] text-foreground">
                            {log.actionCode}
                          </p>
                          <p className="text-[11px] text-muted-foreground/60">
                            {log.entityType}{log.entityId ? ` · ${log.entityId.slice(-8)}` : ""}
                            {log.message ? ` — ${log.message}` : ""}
                          </p>
                        </div>

                        {/* Actor */}
                        <span className="shrink-0 text-[11px] text-muted-foreground/60">
                          {log.actorType === "SYSTEM" ? "System" : log.actorUserId?.slice(-8) ?? log.actorType}
                        </span>

                        {/* Date */}
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
        </>
      )}
    </AdminPageShell>
  );
}
