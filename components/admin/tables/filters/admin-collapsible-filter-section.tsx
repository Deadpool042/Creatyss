"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminCollapsibleFilterSectionProps = {
  title: string;
  description: string;
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function AdminCollapsibleFilterSection({
  title,
  description,
  summary,
  children,
  defaultOpen = false,
}: AdminCollapsibleFilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-panel-soft">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left transition-colors hover:bg-interactive-hover"
        aria-expanded={open}
      >
        <div className="space-y-0.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {title}
          </p>
          <p className="text-xs text-foreground">{description}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-surface-border bg-card px-2 py-1 text-[11px] font-medium text-muted-foreground">
            {summary}
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </div>
      </button>

      {open ? <div className="border-t border-surface-border px-3 py-3">{children}</div> : null}
    </section>
  );
}
