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
  if (flag.dbState.isEffectivelyActive) {
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
 * Liens de navigation vers les sections admin liées au flag.
 * - Flags readonly : toujours affichés (fonctionnalité toujours active).
 * - Autres flags : affichés uniquement si la feature est effectivement active.
 */
function ContextualLinks({ flag }: { flag: AdminFeatureFlagView }) {
  const isReadonly = flag.mutability === "readonly";

  if (!isReadonly && !flag.dbState.isEffectivelyActive) return null;

  const links = resolveContextualLinks(flag.key, flag.dbState.effectiveLevel);
  if (links.length === 0) return null;

  const sectionLabel = isReadonly ? "GÉRER" : "PARAMÈTRES DISPONIBLES";

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
        {sectionLabel}
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
    // Platform — optional
    case "platform.localization":
      return [
        { label: "Réglages", href: "/admin/settings/advanced/optional/localization/settings" },
        { label: "Traductions", href: "/admin/settings/advanced/optional/localization/translations" },
      ];
    case "platform.notifications":
      return [{ label: "Notifications", href: "/admin/settings/notifications" }];
    case "platform.integrations":
      return [{ label: "Intégrations", href: "/admin/settings/integrations" }];
    case "platform.webhooks":
      return [{ label: "Webhooks", href: "/admin/settings/webhooks" }];
    // Satellite
    case "satellite.search":
      return [{ label: "Recherche", href: "/admin/settings/search" }];
    case "satellite.channels":
      return [{ label: "Canaux", href: "/admin/settings/channels" }];
    // AI
    case "ai.core":
      return [{ label: "Réglages IA", href: "/admin/settings/ai" }];
    // Commerce
    case "commerce.fulfillment":
      return [{ label: "Commandes", href: "/admin/commerce/orders" }];
    case "commerce.documents":
      return [{ label: "Documents", href: "/admin/commerce/documents" }];
    case "commerce.taxation":
      return [{ label: "Fiscalité", href: "/admin/commerce/taxation" }];
    case "commerce.payments":
      return [{ label: "Paiements", href: "/admin/commerce/payments" }];
    case "commerce.shipping":
      return [{ label: "Livraison", href: "/admin/settings/shipping" }];
    case "commerce.discounts":
      return [{ label: "Remises", href: "/admin/marketing/discounts" }];
    // Engagement
    case "engagement.newsletter":
      return [{ label: "Newsletter", href: "/admin/marketing/newsletter" }];
    case "engagement.analytics":
      return [{ label: "Analytics", href: "/admin/insights/analytics" }];
    case "engagement.automations":
      return [{ label: "Automations", href: "/admin/marketing/automations" }];
    // Catalog — sections dédiées
    case "catalog.products.pricing":
      return [{ label: "Tarification", href: "/admin/catalog/pricing" }];
    case "catalog.products.media":
      return [{ label: "Médiathèque", href: "/admin/catalog/media" }];
    case "catalog.products.categories":
      return [{ label: "Catégories", href: "/admin/catalog/categories" }];
    // Catalog — gestion par produit
    case "catalog.products.inventory":
    case "catalog.products.availability":
    case "catalog.products.variants":
    case "catalog.products.seo":
    case "catalog.products.related":
      return [{ label: "Produits", href: "/admin/catalog/products" }];
    // Content
    case "content.blog":
      return [{ label: "Blog", href: "/admin/content/blog" }];
    case "content.homepage":
      return [{ label: "Page d'accueil", href: "/admin/content/homepage" }];
    case "content.seo":
      return [{ label: "SEO", href: "/admin/content/seo" }];
    // Maintenance
    case "maintenance.observability":
      return [{ label: "Observabilité", href: "/admin/maintenance/observability" }];
    case "maintenance.logs":
      return [{ label: "Journaux", href: "/admin/maintenance/logs" }];
    // Insights
    case "insights.analyticsRead":
      return [{ label: "Analytics", href: "/admin/insights/analytics" }];
    // settings.advanced : circulaire — pas de lien
    // commerce.returns : page inexistante — pas de lien
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

  const isReadonly = flag.mutability === "readonly";
  const canRenderToggle =
    flag.mutability === "toggleable" ||
    flag.mutability === "level_selectable";

  const isLevelSelectable =
    flag.mutability === "level_selectable" &&
    flag.dbState.isEffectivelyActive &&
    (flag.dbState.allowedLevels?.length ?? 0) > 0;

  return (
    <div className="space-y-5">
      {/* Header : label + toggle (ou note "inclus par défaut" pour readonly) */}
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
        {canRenderToggle && (
          <div className="shrink-0 pt-0.5">
            <FeatureFlagToggle flag={flag} onFeedback={setFeedback} />
          </div>
        )}
      </div>

      {/* Note "inclus par défaut" pour les flags non configurables */}
      {isReadonly && (
        <p className="text-xs text-muted-foreground/60 italic">
          Cette fonctionnalité est incluse par défaut et ne peut pas être désactivée.
        </p>
      )}

      {/* Niveau */}
      {isLevelSelectable && (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
            Niveau d&apos;activation
          </p>
          <FeatureFlagLevelSelect flag={flag} onFeedback={setFeedback} />
        </div>
      )}

      {flag.dependencies !== undefined && flag.dependencies.length > 0 ? (
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60">
            Prérequis
          </p>
          <div className="space-y-2">
            {flag.dependencies.map((dependency) => (
              <div
                key={dependency.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-surface-border/60 bg-surface-panel-soft/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-foreground">
                    {dependency.label}
                  </p>
                  <code className="text-[10px] text-muted-foreground/50">
                    {dependency.key}
                  </code>
                </div>
                <Badge
                  variant="outline"
                  className={
                    dependency.isEffectivelyActive
                      ? "shrink-0 text-[10px] text-feedback-success-foreground border-feedback-success-foreground/40 bg-feedback-success-surface/50"
                      : "shrink-0 text-[10px] text-muted-foreground"
                  }
                >
                  {dependency.isEffectivelyActive
                    ? "Disponible"
                    : dependency.exists
                      ? "Inactif"
                      : "Non créé"}
                </Badge>
              </div>
            ))}
          </div>
          <p className="text-xs leading-5 text-muted-foreground/60">
            Ces prérequis sont informatifs. Les règles serveur restent la source d’autorité.
          </p>
        </div>
      ) : null}

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
