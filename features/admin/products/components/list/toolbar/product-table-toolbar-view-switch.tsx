"use client";

import Link from "next/link";
import type { JSX } from "react";

import { cn } from "@/lib/utils";
import type { ProductListView } from "./product-table-toolbar-types";

type ProductTableToolbarViewSwitchProps = {
  view: ProductListView;
};

export function ProductTableToolbarViewSwitch({
  view,
}: ProductTableToolbarViewSwitchProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/admin/products"
        className={cn(
          "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
          view === "active"
            ? "border-surface-border-strong bg-interactive-selected text-foreground"
            : "border-surface-border bg-surface-panel-soft text-muted-foreground hover:text-foreground"
        )}
      >
        Actifs
      </Link>

      <Link
        href="/admin/products?view=trash"
        className={cn(
          "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
          view === "trash"
            ? "border-surface-border-strong bg-interactive-selected text-foreground"
            : "border-surface-border bg-surface-panel-soft text-muted-foreground hover:text-foreground"
        )}
      >
        Corbeille
      </Link>
    </div>
  );
}
