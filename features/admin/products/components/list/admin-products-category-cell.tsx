"use client";

import type { JSX } from "react";

import { cn } from "@/lib/utils";

type AdminProductsCategoryCellProps = {
  label: string | null;
  className?: string;
};

export function AdminProductsCategoryCell({
  label,
  className,
}: AdminProductsCategoryCellProps): JSX.Element {
  if (!label || label.trim().length === 0) {
    return <span className={cn("text-muted-foreground", className)}>—</span>;
  }

  return <span className={cn("text-sm text-foreground", className)}>{label}</span>;
}
