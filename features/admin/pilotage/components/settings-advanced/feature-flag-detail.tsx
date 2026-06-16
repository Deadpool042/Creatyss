"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Notice } from "@/components/shared";
import type { FeatureFlagFeedback } from "@/features/admin/pilotage/hooks/feature-flag-feedback";
import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { FeatureFlagLevelSelect } from "./feature-flag-level-select";
import { FeatureFlagToggle } from "./feature-flag-toggle";

// ─── Constants ────────────────────────────────────────────────────────────────

const MUTABILITY_LABELS: Record<string, string> = {
  readonly: "Lecture seule",
  toggleable: "Activable",
  configurable: "Configurable",
  level_selectable: "Niveaux",
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ flag }: { flag: AdminFeatureFlagView }) {
  if (flag.unmapped === true) {
    return (
      <Badge variant="outline" className="text-[10px] text-orange-500/80 border-orange-400/40">
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

// ─── Contextual links ─────────────────────────────────────────────────────────

/**
 * Liens de paramètres contextuels selon la clé du flag et le niveau effectif.
 * Chaque flag actif avec des réglages dédiés expose ses liens ici.
 */
function ContextualLinks({
  flag,
}: {
  flag: AdminFeatureFlagView;
}) {
  const isActive = flag.dbState.status === "ACTIVE";
  if (!isActive) return null;

  const level = flag.dbState.effectiveLevel;

  const links = resolveContextualLinks(flag.key, level);
  if (links.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
        Paramètres disponibles
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-1.5 rounded-lg border border-surface-border/60 bg-surface-panel-soft/60 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-surface-subtle/40"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

type ContextualLink = { label: string; href: string };

function resolveContextualLinks(
  key: string,
  _level: string | null
): ContextualLink[] {
  switch (key) {
    case "platform.localization":
      return [
        { label: "Réglages", href: "/admin/settings/advanced/optional/localization/settings" },
        { label: "Traductions", href: "/admin/settings/advanced/optional/localization/translations" },
      ];
    case "platform.notifications":
      return [{ label: "Réglages", href: "/admin/settings/notifications" }];
    case "platform.integrations":
      return [{ label: "Réglages", href: "/admin/settings/integrations" }];
    case "platform.webhooks":
      return [{ label: "Réglages", href: "/admin/settings/webhooks" }];
    case "satellite.search":
      return [{ label: "Réglages", href: "/admin/settings/search" }];
    case "satellite.channels":
      return [{ label: "Réglages", href: "/admin/settings/channels" }];
    case "ai.core":
      return [{ label: "Réglages", href: "/admin/settings/ai" }];
    case "commerce.taxation":
      return [{ label: "Réglages", href: "/admin/commerce/taxation" }];
    default:
      return [];
  }
}

// ─── Props ────────────────────────────────────────────────────────────────────

type FeatureFlagDetailProps = Readonly<{
  flag: AdminFeatureFlagView;
}>;

// ─── Component ────────────────────────────────────────────────────────────────

export function FeatureFlagDetail({ flag }: FeatureFlagDetailProps) {
  const [feedback, setFeedback] = useState<FeatureFlagFeedback | null>(null);

  const isLevelSelectable =
    flag.mutability === "level_selectable" &&
    flag.dbState.status === "ACTIVE" &&
    (flag.dbState.allowedLevels?.length ?? 0) > 0;

  return (
    <div className="space-y-5">
      {/* Header : label + toggle */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">{flag.label}</h2>
            <StatusBadge flag={flag} />
            {flag.mutability !== null && (
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 text-muted-foreground/70">
                {MUTABILITY_LABELS[flag.mutability] ?? flag.mutability}
              </Badge>
            )}
          </div>
          {flag.description ? (
            <p className="text-sm text-muted-foreground">{flag.description}</p>
          ) : null}
          <code className="text-[10px] font-mono text-muted-foreground/50">{flag.key}</code>
        </div>
        <div className="shrink-0 pt-0.5">
          <FeatureFlagToggle flag={flag} onFeedback={setFeedback} />
        </div>
      </div>

      {/* Niveau */}
      {isLevelSelectable && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
            Niveau d&apos;activation
          </p>
          <FeatureFlagLevelSelect flag={flag} onFeedback={setFeedback} />
        </div>
      )}

      {/* Liens contextuels */}
      <ContextualLinks flag={flag} />

      {/* Feedback inline */}
      {feedback !== null && (
        <Notice tone={feedback.tone === "alert" ? "alert" : "success"}>
          {feedback.message}
        </Notice>
      )}
    </div>
  );
}
