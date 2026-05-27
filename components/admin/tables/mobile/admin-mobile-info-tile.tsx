"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminMobileInfoTileProps = Readonly<{
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  bodyClassName?: string;
}>;

export function AdminMobileInfoTile({
  label,
  children,
  className,
  labelClassName,
  bodyClassName,
}: AdminMobileInfoTileProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-surface-border/70 bg-background/35 px-2.5 py-2.5",
        className
      )}
    >
      <p
        className={cn(
          "text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
          labelClassName
        )}
      >
        {label}
      </p>

      <div className={cn("mt-1 min-h-7 text-sm", bodyClassName)}>{children}</div>
    </div>
  );
}
