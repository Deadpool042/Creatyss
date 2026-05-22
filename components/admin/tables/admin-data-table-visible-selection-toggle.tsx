"use client";

import { Checkbox } from "@/components/ui/checkbox";

type AdminDataTableVisibleSelectionToggleProps = {
  checked: boolean;
  ariaLabel: string;
  selectedCount: number;
  totalCount: number;
  onToggle?: () => void;
  className?: string;
};

export function AdminDataTableVisibleSelectionToggle({
  checked,
  ariaLabel,
  selectedCount,
  totalCount,
  onToggle,
  className,
}: AdminDataTableVisibleSelectionToggleProps) {
  return (
    <label
      className={
        className ??
        "flex shrink-0 items-center gap-2 rounded-full border border-surface-border bg-surface-panel-soft px-3 py-2 text-xs font-medium text-foreground"
      }
    >
      <Checkbox
        checked={checked}
        aria-label={ariaLabel}
        {...(onToggle ? { onCheckedChange: onToggle } : {})}
      />
      <span>
        {selectedCount}/{totalCount}
      </span>
    </label>
  );
}
