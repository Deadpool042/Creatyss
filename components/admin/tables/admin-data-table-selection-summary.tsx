"use client";

import { Button } from "@/components/ui/button";

type AdminDataTableSelectionSummaryProps = {
  label: string;
  clearLabel: string;
  onClear: () => void;
  className?: string;
  clearButtonClassName?: string;
};

export function AdminDataTableSelectionSummary({
  label,
  clearLabel,
  onClear,
  className,
  clearButtonClassName,
}: AdminDataTableSelectionSummaryProps) {
  return (
    <div className={className}>
      <p className="truncate text-sm font-medium text-foreground">{label}</p>

      <Button
        variant="ghost"
        size="sm"
        type="button"
        onClick={onClear}
        className={clearButtonClassName}
      >
        {clearLabel}
      </Button>
    </div>
  );
}
