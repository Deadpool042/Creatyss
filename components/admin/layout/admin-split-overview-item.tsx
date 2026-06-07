import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { AdminSplitListItem } from "./admin-split-list-item";

type AdminSplitOverviewItemProps = Readonly<{
  href: string;
  active: boolean;
  title?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  warning?: ReactNode;
  leading?: ReactNode;
  className?: string;
}>;

export function AdminSplitOverviewItem({
  href,
  active,
  title = "Vue d’ensemble",
  description,
  meta,
  warning,
  leading,
  className,
}: AdminSplitOverviewItemProps) {
  return (
    <AdminSplitListItem
      href={href}
      active={active}
      className={cn("flex min-h-16 items-center gap-3 rounded-xl", className)}
    >
      {leading !== undefined ? (
        <div className="flex shrink-0 items-center justify-center">{leading}</div>
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{title}</p>
            {description !== undefined ? (
              <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>

          {meta !== undefined ? (
            <div className="shrink-0 text-xs font-medium text-muted-foreground">{meta}</div>
          ) : null}
        </div>

        {warning !== undefined ? (
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded-full border border-surface-border-subtle bg-surface-panel-soft px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {warning}
            </span>
          </div>
        ) : null}
      </div>
    </AdminSplitListItem>
  );
}
