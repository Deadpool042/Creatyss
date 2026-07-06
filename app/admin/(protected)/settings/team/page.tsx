import { Clock, ShieldCheck, UserCheck, UserX } from "lucide-react";

import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { suspendAdminUserAction } from "@/features/admin/settings/actions/suspend-admin-user.action";
import { reactivateAdminUserAction } from "@/features/admin/settings/actions/reactivate-admin-user.action";
import { CreateAdminUserDrawer } from "@/features/admin/settings/components/create-admin-user-drawer";
import { AdminPageHeader } from "@/components/admin/layout/admin-page-header";
import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { cn } from "@/lib/utils";

import {
  listAdminUsers,
  type AdminUserSummary,
} from "@/features/admin/settings/queries/list-admin-users.query";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

const STATUS_CONFIG: Record<
  AdminUserSummary["status"],
  {
    label: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  INVITED: { label: "Invité", badge: "bg-surface-subtle text-muted-foreground", icon: Clock },
  ACTIVE: {
    label: "Actif",
    badge: "bg-feedback-success-surface/75 text-feedback-success-foreground",
    icon: UserCheck,
  },
  SUSPENDED: {
    label: "Suspendu",
    badge: "bg-feedback-warning-surface/75 text-feedback-warning-foreground",
    icon: UserX,
  },
  ARCHIVED: { label: "Archivé", badge: "bg-surface-subtle text-muted-foreground/60", icon: UserX },
};

async function suspendUser(formData: FormData) {
  "use server";
  await suspendAdminUserAction(formData);
}

async function reactivateUser(formData: FormData) {
  "use server";
  await reactivateAdminUserAction(formData);
}

export default async function AdminSettingsTeamPage() {
  await requireAdminCapability("admin.settings.team.read");
  const currentAdmin = await requireAuthenticatedAdmin();

  let users: AdminUserSummary[] = [];

  try {
    users = await listAdminUsers();
  } catch {
    // Table non disponible
  }

  const active = users.filter((u) => u.status === "ACTIVE").length;
  const invited = users.filter((u) => u.status === "INVITED").length;

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Équipe"
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Réglages" }, { label: "Équipe" }]}
      showTitleInContent={false}
      contentPreset="form"
      topbarAction={<CreateAdminUserDrawer />}
      header={
        <AdminPageHeader
          eyebrow="Accès admin"
          title="Équipe"
          description="Membres ayant accès à l'espace d'administration. Rôles et permissions gérés via le schéma d'identité."
        />
      }
    >
      <div className="space-y-6">
        {users.length === 0 ? (
          <AdminEmptyState
            eyebrow="Aucun membre"
            title="Aucun utilisateur admin"
            description="Les membres invités ou actifs apparaîtront ici."
          />
        ) : (
          <>
            {/* Stats */}
            <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Total", value: users.length },
                {
                  label: "Actifs",
                  value: active,
                  accent: active > 0 ? "text-feedback-success-foreground" : undefined,
                },
                {
                  label: "En attente",
                  value: invited,
                  accent: invited > 0 ? "text-feedback-warning-foreground" : undefined,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 shadow-sm backdrop-blur-sm"
                >
                  <p
                    className={cn(
                      "text-2xl font-semibold tracking-tight",
                      s.accent ?? "text-foreground"
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

            {/* Liste */}
            <div className="divide-y divide-surface-border/40 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
              {users.map((user) => {
                const cfg = STATUS_CONFIG[user.status];
                const StatusIcon = cfg.icon;
                const fullName =
                  [user.firstName, user.lastName].filter(Boolean).join(" ") || user.displayName;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-subtle/20 transition-colors"
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        "flex size-9 shrink-0 items-center justify-center rounded-xl border text-[13px] font-semibold",
                        user.status === "ACTIVE"
                          ? "border-feedback-success-border/50 bg-feedback-success-surface/20 text-feedback-success-foreground"
                          : "border-surface-border/60 bg-surface-subtle text-muted-foreground"
                      )}
                    >
                      {user.email.charAt(0).toUpperCase()}
                    </div>

                    {/* Identité */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {fullName || user.email}
                        </p>
                        {user.roles.length > 0 ? (
                          <span className="hidden shrink-0 items-center gap-1 rounded-full border border-surface-border/60 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-flex">
                            <ShieldCheck className="size-3" />
                            {user.roles[0]}
                            {user.roles.length > 1 ? ` +${user.roles.length - 1}` : ""}
                          </span>
                        ) : null}
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>

                    {/* Dernière connexion */}
                    <div className="hidden shrink-0 text-right lg:block">
                      {user.lastLoginAt ? (
                        <>
                          <p className="text-[11px] text-muted-foreground/60">Dernière connexion</p>
                          <p className="text-[11px] font-medium text-muted-foreground">
                            {dateTimeFormatter.format(new Date(user.lastLoginAt))}
                          </p>
                        </>
                      ) : (
                        <p className="text-[11px] text-muted-foreground/40">Jamais connecté</p>
                      )}
                    </div>

                    {/* Date invitation/activation */}
                    <span className="hidden shrink-0 text-[11px] text-muted-foreground/60 sm:block">
                      {user.activatedAt
                        ? dateFormatter.format(new Date(user.activatedAt))
                        : user.invitedAt
                          ? `Invité le ${dateFormatter.format(new Date(user.invitedAt))}`
                          : dateFormatter.format(new Date(user.createdAt))}
                    </span>

                    {/* Statut */}
                    <span
                      className={cn(
                        "shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium",
                        cfg.badge
                      )}
                    >
                      <StatusIcon className="size-3" />
                      {cfg.label}
                    </span>

                    {/* Actions */}
                    {user.status === "ACTIVE" && user.id !== currentAdmin.id && (
                      <form action={suspendUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground/60 hover:bg-feedback-warning-surface/30 hover:text-feedback-warning-foreground transition-colors"
                        >
                          Suspendre
                        </button>
                      </form>
                    )}
                    {user.status === "SUSPENDED" && user.id !== currentAdmin.id && (
                      <form action={reactivateUser}>
                        <input type="hidden" name="userId" value={user.id} />
                        <button
                          type="submit"
                          className="shrink-0 rounded-md px-2 py-1 text-[11px] font-medium text-muted-foreground/60 hover:bg-feedback-success-surface/30 hover:text-feedback-success-foreground transition-colors"
                        >
                          Réactiver
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </AdminPageShell>
  );
}
