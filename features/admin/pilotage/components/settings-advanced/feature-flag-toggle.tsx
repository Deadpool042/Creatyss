"use client";

import { cn } from "@/lib/utils";
import type { OnFeatureFlagFeedback } from "@/features/admin/pilotage/hooks/feature-flag-feedback";
import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { useFeatureFlagToggle } from "@/features/admin/pilotage/hooks/use-feature-flag-toggle";

// ─── Toggle button (presentational) ──────────────────────────────────────────

function ToggleButton({
  flag,
  isActive,
  canToggle,
  isPending,
  onToggle,
}: {
  flag: AdminFeatureFlagView;
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
      aria-label={isActive ? `Désactiver ${flag.label}` : `Activer ${flag.label}`}
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

type FeatureFlagToggleProps = Readonly<{
  flag: AdminFeatureFlagView;
  onFeedback?: OnFeatureFlagFeedback;
}>;

// ─── Main export — self-contained optimistic toggle ───────────────────────────

export function FeatureFlagToggle({ flag, onFeedback }: FeatureFlagToggleProps) {
  const { isActive, canToggle, isPending, handleToggle } =
    useFeatureFlagToggle(flag, onFeedback);

  return (
    <ToggleButton
      flag={flag}
      isActive={isActive}
      canToggle={canToggle}
      isPending={isPending}
      onToggle={handleToggle}
    />
  );
}
