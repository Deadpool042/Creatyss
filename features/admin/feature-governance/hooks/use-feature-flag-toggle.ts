"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { toast } from "@/components/shared";
import { toggleFeatureFlagAction } from "@/features/admin/feature-governance/actions/toggle-feature-flag.action";
import type { OnFeatureFlagFeedback } from "@/features/admin/feature-governance/hooks/feature-flag-feedback";
import type { AdminFeatureFlagView } from "@/features/admin/feature-governance/queries/list-admin-feature-flags.query";

type ToggleStatus = "ACTIVE" | "INACTIVE" | "DRAFT" | "ARCHIVED" | null;

export function useFeatureFlagToggle(
  flag: AdminFeatureFlagView,
  onFeedback?: OnFeatureFlagFeedback
) {
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
    const previousStatus = optimisticStatus;
    const nextStatus: ToggleStatus = isActive ? "INACTIVE" : "ACTIVE";

    startTransition(async () => {
      setOptimisticStatus(nextStatus);
      const result = await toggleFeatureFlagAction(flagId);

      if (!result.ok) {
        setOptimisticStatus(previousStatus);
        toast.error(result.error);
        onFeedback?.({ tone: "alert", message: result.error });
        return;
      }

      toast.success(result.message);
      onFeedback?.({ tone: "success", message: result.message });
      router.refresh();
    });
  }

  return { isActive, canToggle, isPending, handleToggle };
}
