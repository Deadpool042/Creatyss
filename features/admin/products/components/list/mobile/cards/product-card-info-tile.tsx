"use client";

import type { JSX, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProductCardInfoTileProps = {
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  bodyClassName?: string;
};

export function ProductCardInfoTile({
  label,
  children,
  className,
  labelClassName,
  bodyClassName,
}: ProductCardInfoTileProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border bg-surface-panel-soft px-3 py-3",
        className
      )}
    >
      <p
        className={cn(
          "text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
          labelClassName
        )}
      >
        {label}
      </p>

      <div className={cn("mt-1.5 min-h-8 text-sm", bodyClassName)}>{children}</div>
    </div>
  );
}
