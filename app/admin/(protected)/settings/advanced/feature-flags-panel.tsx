"use client";

import { useOptimistic, useTransition } from "react";
import { Globe, Lock, User, Zap } from "lucide-react";

import { cn } from "@/lib/utils";
import { toggleFeatureFlagAction } from "@/features/admin/pilotage/actions/toggle-feature-flag.action";
import type { AdminFeatureFlagSummary } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";

const SCOPE_ICONS = {
  GLOBAL: Globe,
  STORE: Lock,
  USER: User,
};

const SCOPE_LABELS = { GLOBAL: "Global", STORE: "Boutique", USER: "Utilisateur" };

type Props = { flags: AdminFeatureFlagSummary[] };

export function FeatureFlagsPanel({ flags }: Props) {
  const [optimisticFlags, toggleOptimistic] = useOptimistic(
    flags,
    (state, flagId: string) =>
      state.map((f) =>
        f.id === flagId
          ? { ...f, status: f.status === "ACTIVE" ? ("INACTIVE" as const) : ("ACTIVE" as const) }
          : f
      )
  );
  const [isPending, startTransition] = useTransition();

  if (flags.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-8 text-center shadow-sm backdrop-blur-sm">
        <Zap className="mx-auto mb-3 size-8 text-muted-foreground/30" />
        <p className="text-sm font-medium text-foreground">Aucun feature flag</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Créez des feature flags via le schéma Prisma pour contrôler les fonctionnalités.
        </p>
        <p className="mt-2 font-mono text-[11px] text-muted-foreground/50">
          prisma/cross-cutting/feature-flags.prisma
        </p>
      </div>
    );
  }

  const active = optimisticFlags.filter((f) => f.status === "ACTIVE").length;
  const inactive = optimisticFlags.filter((f) => f.status === "INACTIVE").length;
  const draft = optimisticFlags.filter((f) => f.status === "DRAFT").length;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Actifs", value: active, accent: active > 0 ? "text-feedback-success-foreground" : undefined },
          { label: "Inactifs", value: inactive },
          { label: "Brouillons", value: draft },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 shadow-sm backdrop-blur-sm text-center">
            <p className={cn("text-2xl font-semibold tracking-tight", s.accent ?? "text-foreground")}>{s.value}</p>
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Liste */}
      <div className="divide-y divide-surface-border/40 rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm overflow-hidden">
        {optimisticFlags.map((flag) => {
          const ScopeIcon = SCOPE_ICONS[flag.scopeType] ?? Globe;
          const isActive = flag.status === "ACTIVE";
          const canToggle = flag.status !== "ARCHIVED";

          return (
            <div key={flag.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-subtle/20 transition-colors">
              {/* Toggle */}
              <button
                type="button"
                disabled={!canToggle || isPending}
                onClick={() => {
                  if (!canToggle) return;
                  startTransition(async () => {
                    toggleOptimistic(flag.id);
                    await toggleFeatureFlagAction(flag.id);
                  });
                }}
                aria-label={isActive ? `Désactiver ${flag.name}` : `Activer ${flag.name}`}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 disabled:cursor-not-allowed disabled:opacity-50",
                  isActive
                    ? "border-feedback-success-foreground/60 bg-feedback-success-foreground/80"
                    : "border-surface-border bg-surface-subtle"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200",
                    isActive ? "translate-x-4" : "translate-x-0.5"
                  )}
                />
              </button>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-medium text-foreground">{flag.name}</p>
                  <code className="rounded bg-surface-subtle px-1 font-mono text-[10px] text-muted-foreground/60">
                    {flag.code}
                  </code>
                </div>
                {flag.description ? (
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{flag.description}</p>
                ) : null}
              </div>

              {/* Scope */}
              <div className="flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground/60">
                <ScopeIcon className="size-3.5" />
                {SCOPE_LABELS[flag.scopeType]}
              </div>

              {/* Status badge */}
              <span className={cn(
                "shrink-0 inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium",
                isActive
                  ? "bg-feedback-success-surface/75 text-feedback-success-foreground"
                  : flag.status === "DRAFT"
                    ? "bg-surface-subtle text-muted-foreground/70"
                    : "bg-surface-subtle text-muted-foreground"
              )}>
                {flag.status === "ACTIVE" ? "Actif" : flag.status === "INACTIVE" ? "Inactif" : flag.status === "DRAFT" ? "Brouillon" : "Archivé"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
