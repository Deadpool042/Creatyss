"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { AdminDataTableFloatingBar } from "./admin-data-table-floating-bar";

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
    <AdminDataTableFloatingBar
      innerClassName={cn(
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
    </AdminDataTableFloatingBar>
  );
}
