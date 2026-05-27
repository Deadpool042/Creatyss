"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminDataTableFiltersFooterProps = {
  resetLabel: string;
  applyLabel: string;
  onReset: () => void;
  onApply: () => void;
  resetDisabled?: boolean;
  stacked?: boolean;
  className?: string;
};

export function AdminDataTableFiltersFooter({
  resetLabel,
  applyLabel,
  onReset,
  onApply,
  resetDisabled = false,
  stacked = false,
  className,
}: AdminDataTableFiltersFooterProps) {
  return (
    <div
      className={cn(
        stacked ? "flex flex-col gap-2" : "flex items-center justify-between gap-3",
        className,
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={onReset}
        disabled={resetDisabled}
        className={cn(
          stacked
            ? "w-full text-muted-foreground"
            : "h-9 rounded-full px-3 text-muted-foreground [@media(max-height:480px)]:h-8",
        )}
      >
        {resetLabel}
      </Button>

      <Button
        size="sm"
        type="button"
        onClick={onApply}
        className={cn(
          stacked
            ? "w-full"
            : "h-9 rounded-full px-4 [@media(max-height:480px)]:h-8",
        )}
      >
        {applyLabel}
      </Button>
    </div>
  );
}
