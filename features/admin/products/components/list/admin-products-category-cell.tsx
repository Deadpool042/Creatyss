"use client";

import type { JSX } from "react";

type AdminProductsCategoryCellProps = {
  label: string | null;
};

export function AdminProductsCategoryCell({
  label,
}: AdminProductsCategoryCellProps): JSX.Element {
  if (!label || label.trim().length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  return <span className="text-sm text-foreground">{label}</span>;
}
