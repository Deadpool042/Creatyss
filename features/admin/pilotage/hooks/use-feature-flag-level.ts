"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { toast } from "@/components/shared";
import { setFeatureFlagLevelAction } from "@/features/admin/pilotage/actions/set-feature-flag-level.action";
import type { OnFeatureFlagFeedback } from "@/features/admin/pilotage/hooks/feature-flag-feedback";
import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";

export function useFeatureFlagLevel(
  flag: AdminFeatureFlagView,
  onFeedback?: OnFeatureFlagFeedback
) {
  const router = useRouter();
  const allowedLevels = flag.levels ?? [];
  const dbStatus = flag.dbState.status;

  const initialLevel = flag.dbState.effectiveLevel ?? allowedLevels[0] ?? null;

  const [currentLevel, setCurrentLevel] = useOptimistic(
    initialLevel,
    (_prev: string | null, next: string | null) => next
  );

  const [isPending, startTransition] = useTransition();

  const canSelect =
    flag.dbState.id !== null &&
    flag.mutability === "level_selectable" &&
    allowedLevels.length > 0 &&
    dbStatus !== "ARCHIVED" &&
    dbStatus !== null;

  function handleSelect(level: string) {
    if (!canSelect || flag.dbState.id === null || level === currentLevel) return;
    const flagId = flag.dbState.id;
    const previousLevel = currentLevel;

    startTransition(async () => {
      setCurrentLevel(level);
      const result = await setFeatureFlagLevelAction(flagId, level);

      if (!result.ok) {
        setCurrentLevel(previousLevel);
        toast.error(result.error);
        onFeedback?.({ tone: "alert", message: result.error });
        return;
      }

      toast.success(result.message);
      onFeedback?.({ tone: "success", message: result.message });
      router.refresh();
    });
  }

  return { allowedLevels, currentLevel, canSelect, isPending, handleSelect };
}
