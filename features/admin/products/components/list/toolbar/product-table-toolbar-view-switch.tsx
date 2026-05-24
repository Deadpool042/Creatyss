"use client";

import Link from "next/link";
import type { JSX } from "react";

import { PRODUCT_LIST_VIEW_OPTIONS } from "@/features/admin/products/config";
import type { ProductListView } from "@/features/admin/products/list/types";
import { cn } from "@/lib/utils";

type ProductTableToolbarViewSwitchProps = {
  view: ProductListView;
  className?: string;
};

export function ProductTableToolbarViewSwitch({
  view,
  className,
}: ProductTableToolbarViewSwitchProps): JSX.Element {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {PRODUCT_LIST_VIEW_OPTIONS.map((option) => (
        <Link
          key={option.value}
          href={option.href}
          className={cn(
            "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
            view === option.value
              ? "border-surface-border-strong bg-interactive-selected text-foreground"
              : "border-surface-border bg-surface-panel-soft text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}
