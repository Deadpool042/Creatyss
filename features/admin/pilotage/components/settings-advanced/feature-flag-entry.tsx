"use client";

import Link from "next/link";
import { ChevronRight, Globe, Lock, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { flagSlugFromKey } from "@/features/admin/pilotage/view-models/settings-advanced";
import { FeatureFlagToggle } from "./feature-flag-toggle";

// ─── Constants ────────────────────────────────────────────────────────────────

const MUTABILITY_LABELS: Record<string, string> = {
  readonly: "Lecture seule",
  toggleable: "Activable",
  configurable: "Configurable",
  level_selectable: "Niveaux",
};

const SCOPE_ICONS = {
  GLOBAL: Globe,
  STORE: Lock,
  USER: User,
} as const;

const SCOPE_LABELS: Record<"GLOBAL" | "STORE" | "USER", string> = {
  GLOBAL: "Global",
  STORE: "Boutique",
  USER: "Utilisateur",
};

// ─── DB state badge ───────────────────────────────────────────────────────────

function DbStateBadge({ flag }: { flag: AdminFeatureFlagView }) {
  if (flag.unmapped === true) {
    return (
      <Badge
        variant="outline"
        className="text-[10px] text-orange-500/80 border-orange-400/40"
      >
        Non catalogué
      </Badge>
    );
  }
  if (!flag.dbState.exists) {
    return (
      <Badge variant="outline" className="text-[10px] text-muted-foreground/50">
        Non créé
      </Badge>
    );
  }
  if (flag.dbState.status === "ACTIVE") {
    return (
      <Badge
        variant="outline"
        className="text-[10px] text-feedback-success-foreground border-feedback-success-foreground/40 bg-feedback-success-surface/50"
      >
        Actif
      </Badge>
    );
  }
  if (flag.dbState.status === "DRAFT") {
    return (
      <Badge variant="outline" className="text-[10px] text-muted-foreground/70">
        Brouillon
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px] text-muted-foreground">
      Inactif
    </Badge>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type FeatureFlagEntryProps = Readonly<{
  flag: AdminFeatureFlagView;
}>;

// ─── Component ────────────────────────────────────────────────────────────────

export function FeatureFlagEntry({ flag }: FeatureFlagEntryProps) {
  const scopeType = flag.dbState.scopeType;
  const ScopeIcon = scopeType ? (SCOPE_ICONS[scopeType] ?? Globe) : null;

  const detailHref =
    flag.unmapped !== true && flag.family !== null
      ? `/admin/settings/advanced/${flag.family}/${flagSlugFromKey(flag.key)}`
      : null;

  return (
    <div className="flex flex-col gap-2 px-4 py-3.5 transition-colors hover:bg-surface-subtle/12 sm:flex-row sm:items-center sm:gap-3">
      {/* Left: info block */}
      <div className="min-w-0 flex-1 space-y-1">
        {/* Row 1: label + mutability badge */}
        <div className="flex flex-wrap items-center gap-1.5">
          {detailHref !== null ? (
            <Link
              href={detailHref}
              className="text-[13px] font-medium text-foreground transition-colors hover:text-foreground/70 inline-flex items-center gap-0.5"
            >
              {flag.label}
              <ChevronRight className="size-3 text-muted-foreground/50" />
            </Link>
          ) : (
            <span className="text-[13px] font-medium text-foreground">
              {flag.label}
            </span>
          )}
          {flag.mutability !== null && (
            <Badge
              variant="outline"
              className="text-[10px] h-4 px-1.5 text-muted-foreground/80"
            >
              {MUTABILITY_LABELS[flag.mutability] ?? flag.mutability}
            </Badge>
          )}
        </div>

        {/* Row 2: description */}
        {flag.description ? (
          <p className="text-xs text-muted-foreground">{flag.description}</p>
        ) : null}

        {/* Row 3: key + module */}
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded px-1 font-mono text-[10px] text-muted-foreground/56">
            {flag.key}
          </code>
          {flag.module !== null && (
            <span className="text-[10px] text-muted-foreground/50">
              module : {flag.module}
            </span>
          )}
        </div>

        {/* Row 4: DB state badge */}
        <div className="flex flex-wrap items-center gap-2">
          <DbStateBadge flag={flag} />
        </div>
      </div>

      {/* Right: scope + toggle (toggle masqué pour les flags readonly) */}
      <div className="flex shrink-0 items-center gap-3">
        {ScopeIcon !== null && scopeType !== null ? (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
            <ScopeIcon className="size-3.5" />
            {SCOPE_LABELS[scopeType]}
          </div>
        ) : null}
        {flag.mutability !== "readonly" && <FeatureFlagToggle flag={flag} />}
      </div>
    </div>
  );
}
