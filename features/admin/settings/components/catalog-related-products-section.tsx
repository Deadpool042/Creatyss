"use client";

import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { useFeatureFlagToggle } from "@/features/admin/pilotage/hooks/use-feature-flag-toggle";
import { cn } from "@/lib/utils";

// ─── Toggle button ────────────────────────────────────────────────────────────

function ToggleButton({
  label,
  isActive,
  canToggle,
  isPending,
  onToggle,
}: {
  label: string;
  isActive: boolean;
  canToggle: boolean;
  isPending: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!canToggle || isPending}
      onClick={onToggle}
      aria-label={isActive ? `Désactiver ${label}` : `Activer ${label}`}
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
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type CatalogRelatedProductsSectionProps = Readonly<{
  flag: AdminFeatureFlagView | null;
}>;

// ─── Fallback when flag has no DB row yet ─────────────────────────────────────

function FallbackState() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
      Non configuré — le flag doit être créé en base pour être activé.
    </div>
  );
}

// ─── Toggle section with live state ──────────────────────────────────────────

function RelatedProductsToggle({ flag }: { flag: AdminFeatureFlagView }) {
  const { isActive, canToggle, isPending, handleToggle } =
    useFeatureFlagToggle(flag);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium text-foreground">
          {isActive ? "Activée" : "Désactivée"}
        </p>
        <p className="text-xs text-muted-foreground">
          {isActive
            ? "Des produits similaires seront proposés sur chaque page produit."
            : "Aucune suggestion ne sera affichée sur les pages produit."}
        </p>
      </div>
      <ToggleButton
        label={flag.label}
        isActive={isActive}
        canToggle={canToggle}
        isPending={isPending}
        onToggle={handleToggle}
      />
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function CatalogRelatedProductsSection({
  flag,
}: CatalogRelatedProductsSectionProps) {
  return (
    <section className="rounded-lg border border-surface-border bg-surface px-5 py-4 space-y-3">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">
          Produits liés
        </h2>
        <p className="text-xs text-muted-foreground">
          Lorsque cette option est activée, une sélection de produits similaires
          ou complémentaires apparaît sur chaque page produit. Cela peut
          encourager la découverte et augmenter le panier moyen.
        </p>
      </div>

      {/* Control */}
      {flag === null || !flag.dbState.exists ? (
        <FallbackState />
      ) : (
        <RelatedProductsToggle flag={flag} />
      )}
    </section>
  );
}
