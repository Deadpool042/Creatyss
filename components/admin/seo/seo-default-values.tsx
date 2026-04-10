"use client";

import type { JSX } from "react";

import { cn } from "@/lib/utils";

type SeoDefaultValuesProps = {
  items: ReadonlyArray<{
    label: string;
    value: string;
  }>;
  className?: string;
};

export function SeoDefaultValues({ items, className }: SeoDefaultValuesProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-xl border border-surface-border bg-surface-panel p-3.5 md:p-4",
        className
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Valeurs par défaut
      </p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {item.label}
            </p>
            <p className="wrap-break-word text-sm text-foreground">
              {item.value.trim().length > 0 ? item.value : "Aucune valeur calculée"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
