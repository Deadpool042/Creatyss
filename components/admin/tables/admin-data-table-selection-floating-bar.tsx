"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDataTableSelectionFloatingBarProps = Readonly<{
  selectionLabel: string;
  clearSelectionLabel: string;
  onClearSelection: () => void;
  disabled?: boolean;
  children: ReactNode;
  innerClassName?: string;
  actionsClassName?: string;
}>;

export function AdminDataTableSelectionFloatingBar({
  selectionLabel,
  clearSelectionLabel,
  onClearSelection,
  disabled = false,
  children,
  innerClassName,
  actionsClassName,
}: AdminDataTableSelectionFloatingBarProps) {
  return (
    <div className="sticky bottom-4 flex justify-center">
      <div
        className={cn(
          "rounded-xl border border-surface-border bg-surface-panel/95 shadow-lg",
          "animate-in fade-in slide-in-from-bottom-2 duration-200",
          "flex flex-wrap items-center gap-3 px-4 py-2.5 backdrop-blur-sm",
          innerClassName
        )}
      >
        <span className="text-sm font-medium text-foreground">{selectionLabel}</span>

        <div className="h-4 w-px bg-surface-border" />

        <div className={cn("flex flex-wrap items-center gap-2", actionsClassName)}>{children}</div>

        <button
          type="button"
          onClick={onClearSelection}
          disabled={disabled}
          className="ml-1 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
          aria-label={clearSelectionLabel}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
