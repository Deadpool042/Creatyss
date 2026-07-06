import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Widget de pilotage générique (domaine `dashboarding`, cf.
 * `docs/roadmap/analyses-cockpit-analytique/lot-6-tracking-dashboarding-cadrage.md`) :
 * matérialisation déclarative, sans persistance Prisma — un dashboard
 * consommateur compose ses props, aucune configuration en base.
 */
export function KpiCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  accent,
  isMock = true,
}: {
  label: string;
  value: string;
  /** `null` : variation non calculable (référence à zéro). */
  delta: number | null;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
  isMock?: boolean;
}) {
  const isPositiveTone = delta !== null && delta >= 0;
  const DeltaIcon = isPositiveTone ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-5 py-4 shadow-sm backdrop-blur-sm",
        accent
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {label}
          {isMock ? (
            <span className="ml-1.5 font-normal text-muted-foreground/40">(mock)</span>
          ) : null}
        </p>
        <Icon className="size-4 shrink-0 text-muted-foreground/40" />
      </div>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <div className="flex items-center gap-1.5">
        {delta === null ? (
          <span className="text-xs font-medium text-muted-foreground/60">—</span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              isPositiveTone ? "text-feedback-success-foreground" : "text-feedback-error-foreground"
            )}
          >
            <DeltaIcon className="size-3" />
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}
