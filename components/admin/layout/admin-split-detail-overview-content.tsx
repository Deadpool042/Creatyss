import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSplitDetailOverviewGridProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function AdminSplitDetailOverviewGrid({
  children,
  className,
}: AdminSplitDetailOverviewGridProps) {
  return (
    <div
      className={cn(
        "admin-split-detail-overview-grid grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]",
        className
      )}
    >
      {children}
    </div>
  );
}

type AdminSplitDetailOverviewEmptyStateProps = Readonly<{
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}>;

export function AdminSplitDetailOverviewEmptyState({
  title,
  description,
  className,
}: AdminSplitDetailOverviewEmptyStateProps) {
  return (
    <div
      className={cn(
        "admin-split-detail-overview-empty mt-5 rounded-xl border border-dashed border-surface-border bg-surface-panel-soft px-5 py-8 text-center",
        className
      )}
    >
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description !== undefined ? (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
