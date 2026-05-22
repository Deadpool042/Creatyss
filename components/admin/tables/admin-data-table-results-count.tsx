"use client";

import { cn } from "@/lib/utils";

type AdminDataTableResultsCountProps = {
  count: number;
  fullLabel: (count: number) => string;
  shortLabel: (count: number) => string;
  className?: string | undefined;
};

export function AdminDataTableResultsCount({
  count,
  fullLabel,
  shortLabel,
  className,
}: AdminDataTableResultsCountProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[10px] font-medium italic text-muted-foreground sm:text-[11px]",
        className,
      )}
    >
      <span className="[@media(max-height:480px)]:hidden">{fullLabel(count)}</span>
      <span className="hidden [@media(max-height:480px)]:inline">{shortLabel(count)}</span>
    </span>
  );
}
