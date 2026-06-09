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

type AdminSplitDetailSectionCardProps = Readonly<{
  children: ReactNode;
  className?: string;
  tone?: "primary" | "secondary";
  contentClassName?: string;
}>;

export function AdminSplitDetailSectionCard({
  children,
  className,
  tone = "primary",
  contentClassName,
}: AdminSplitDetailSectionCardProps) {
  return (
    <section
      className={cn(
        "admin-split-detail-overview-card rounded-2xl border p-5 backdrop-blur-xl",
        tone === "primary"
          ? "border-surface-border bg-surface-panel shadow-card"
          : "border-surface-border bg-surface-panel-soft shadow-sm",
        className,
        contentClassName
      )}
    >
      {children}
    </section>
  );
}


type AdminSplitDetailSectionHeaderProps = Readonly<{
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}>;

export function AdminSplitDetailSectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: AdminSplitDetailSectionHeaderProps) {
  return (
    <div
      className={cn(
        "admin-split-detail-overview-section-header flex items-end justify-between gap-4",
        className
      )}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description !== undefined ? (
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}


type AdminSplitDetailFactProps = Readonly<{
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
  className?: string;
}>;

export function AdminSplitDetailFact({
  label,
  value,
  description,
  className,
}: AdminSplitDetailFactProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-3 shadow-sm",
        className
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold leading-6 text-foreground">{value}</p>
      {description !== undefined ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      ) : null}
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
