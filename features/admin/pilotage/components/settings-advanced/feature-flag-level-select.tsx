"use client";

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

  const currentLevelDescription =
    currentLevel !== null ? (flag.levelDescriptions?.[currentLevel] ?? null) : null;

  return (
    <div className="space-y-1.5">
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
              {humanizeLevel(level)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentLevelDescription !== null ? (
        <p className="text-xs leading-5 text-muted-foreground/70">{currentLevelDescription}</p>
      ) : null}
    </div>
  );
}
