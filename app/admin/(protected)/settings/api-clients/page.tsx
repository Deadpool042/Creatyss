import { Key, ShieldOff } from "lucide-react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { cn } from "@/lib/utils";
import { listAdminApiClients, type AdminApiClientSummary } from "@/features/admin/settings/queries/list-admin-api-clients.query";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
});

const STATUS_CONFIG: Record<AdminApiClientSummary["status"], { label: string; badge: string }> = {
  DRAFT: { label: "Brouillon", badge: "bg-surface-subtle text-muted-foreground" },
  ACTIVE: { label: "Actif", badge: "bg-feedback-success-surface/75 text-feedback-success-foreground" },
  INACTIVE: { label: "Inactif", badge: "bg-surface-subtle text-muted-foreground/70" },
  REVOKED: { label: "Révoqué", badge: "bg-feedback-error-surface/75 text-feedback-error-foreground" },
  ARCHIVED: { label: "Archivé", badge: "bg-surface-subtle text-muted-foreground/50" },
};

export default async function AdminSettingsApiClientsPage() {
  await requireAdminCapability("admin.settings.api-clients.read");

  let clients: AdminApiClientSummary[] = [];

  try {
    clients = await listAdminApiClients();
  } catch {
    // Table non disponible
  }

  const active = clients.filter((c) => c.status === "ACTIVE").length;
  const revoked = clients.filter((c) => c.status === "REVOKED").length;

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Clés API"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Réglages" },
        { label: "Clés API" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentPreset="form"
    >
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">Sécurité</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Clés API</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Clients API autorisés à interagir avec l'API admin. Modèle :{" "}
            <code className="rounded bg-surface-subtle px-1 font-mono text-[11px]">ApiClient</code>
          </p>
        </div>

        {clients.length === 0 ? (
          <AdminEmptyState
            eyebrow="Aucune clé"
            title="Aucun client API configuré"
            description="Les clients API permettent aux intégrations tierces d'accéder à l'API admin de manière sécurisée."
          />
        ) : (
          <>
            <div className="mb-4 grid grid-cols-3 gap-3">
              {[
                { label: "Total", value: clients.length },
                { label: "Actifs", value: active, accent: active > 0 ? "text-feedback-success-foreground" : undefined },
                { label: "Révoqués", value: revoked, accent: revoked > 0 ? "text-feedback-error-foreground" : undefined },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 shadow-sm backdrop-blur-sm">
                  <p className={cn("text-2xl font-semibold tracking-tight", s.accent ?? "text-foreground")}>{s.value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="divide-y divide-surface-border/40 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
              {clients.map((client) => {
                const cfg = STATUS_CONFIG[client.status];
                return (
                  <div key={client.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-subtle/20 transition-colors">
                    <div className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                      client.status === "REVOKED"
                        ? "border-feedback-error-border/50 bg-feedback-error-surface/20"
                        : client.status === "ACTIVE"
                          ? "border-feedback-success-border/50 bg-feedback-success-surface/20"
                          : "border-surface-border/60 bg-surface-subtle"
                    )}>
                      {client.status === "REVOKED" ? (
                        <ShieldOff className="size-4 text-feedback-error-foreground" />
                      ) : (
                        <Key className={cn("size-4", client.status === "ACTIVE" ? "text-feedback-success-foreground" : "text-muted-foreground/60")} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-foreground">{client.name}</p>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-[11px] text-muted-foreground/60">{client.code}</code>
                        <span className="text-muted-foreground/30">·</span>
                        <code className="font-mono text-[11px] text-muted-foreground/40">{client.clientId.slice(0, 12)}…</code>
                      </div>
                    </div>

                    <div className="hidden shrink-0 text-right lg:block">
                      {client.lastUsedAt ? (
                        <>
                          <p className="text-[11px] text-muted-foreground/60">Dernier usage</p>
                          <p className="text-[11px] font-medium text-muted-foreground">
                            {dateTimeFormatter.format(new Date(client.lastUsedAt))}
                          </p>
                        </>
                      ) : (
                        <p className="text-[11px] text-muted-foreground/40">Jamais utilisé</p>
                      )}
                    </div>

                    <span className="hidden shrink-0 text-[11px] text-muted-foreground/60 sm:block">
                      {dateFormatter.format(new Date(client.createdAt))}
                    </span>

                    <span className={cn("shrink-0 inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium", cfg.badge)}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-muted-foreground/50">
              Création et révocation de clés disponibles prochainement.
            </p>
          </>
        )}
      </div>
    </AdminPageShell>
  );
}
