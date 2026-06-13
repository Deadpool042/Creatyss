"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { toggleFeatureFlagAction } from "@/features/admin/pilotage/actions/toggle-feature-flag.action";
import type { AdminFeatureFlagView } from "@/features/admin/pilotage/queries/list-admin-feature-flags.query";

type ToggleStatus = "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED" | null;

export function useFeatureFlagToggle(flag: AdminFeatureFlagView) {
  const router = useRouter();
  const dbStatus: ToggleStatus = flag.dbState.status ?? null;

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    dbStatus,
    (_prev: ToggleStatus, next: ToggleStatus) => next
  );

  const [isPending, startTransition] = useTransition();

  const isActive = optimisticStatus === "ACTIVE";
  const canToggle =
    flag.dbState.id !== null &&
    (flag.mutability === "toggleable" || flag.mutability === "level_selectable") &&
    optimisticStatus !== "ARCHIVED" &&
    optimisticStatus !== null;

  function handleToggle() {
    if (!canToggle || flag.dbState.id === null) return;
    const flagId = flag.dbState.id;
    startTransition(async () => {
      setOptimisticStatus(isActive ? "INACTIVE" : "ACTIVE");
      await toggleFeatureFlagAction(flagId);
      router.refresh();
    });
  }

  return { isActive, canToggle, isPending, handleToggle };
}
