"use client";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OnFeatureFlagFeedback } from "@/features/admin/pilotage/hooks/feature-flag-feedback";
import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";
import { useFeatureFlagLevel } from "@/features/admin/pilotage/hooks/use-feature-flag-level";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Repli si un niveau n'a pas (encore) de libellé FR dans le catalogue — ne doit pas masquer un oubli. */
function humanizeLevel(level: string): string {
  const withSpaces = level.replace(/[-_]/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

// ─── Props ────────────────────────────────────────────────────────────────────

type FeatureFlagLevelSelectProps = Readonly<{
  flag: AdminFeatureFlagView;
  onFeedback?: OnFeatureFlagFeedback;
}>;

// ─── Component ────────────────────────────────────────────────────────────────

export function FeatureFlagLevelSelect({ flag, onFeedback }: FeatureFlagLevelSelectProps) {
  const { allowedLevels, currentLevel, canSelect, isPending, handleSelect } = useFeatureFlagLevel(
    flag,
    onFeedback
  );

  if (allowedLevels.length === 0) {
    return null;
  }

  function labelFor(level: string): string {
    return flag.levelLabels?.[level] ?? humanizeLevel(level);
  }

  return (
    <div className="space-y-2.5">
      <Select
        onValueChange={handleSelect}
        disabled={!canSelect || isPending}
        {...(currentLevel !== null ? { value: currentLevel } : {})}
      >
        <SelectTrigger size="sm" aria-label={`Niveau de ${flag.label}`}>
          <SelectValue placeholder="Niveau" />
        </SelectTrigger>
        <SelectContent>
          {allowedLevels.map((level) => (
            <SelectItem key={level} value={level}>
              {labelFor(level)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ul className="space-y-1.5 rounded-md border border-border/60 bg-muted/20 p-2.5">
        {allowedLevels.map((level) => {
          const isCurrent = level === currentLevel;
          const description = flag.levelDescriptions?.[level] ?? null;

          return (
            <li key={level} className="text-xs leading-5">
              <span
                className={cn(
                  "font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground/80"
                )}
              >
                {labelFor(level)}
                {isCurrent ? (
                  <span className="ml-1.5 rounded-sm bg-foreground/10 px-1 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground/70">
                    Actuel
                  </span>
                ) : null}
              </span>
              {description !== null ? (
                <p className="text-muted-foreground/70">{description}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
