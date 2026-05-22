"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDataTableFloatingBarProps = {
  children: ReactNode;
  mode?: "sticky" | "fixed";
  outerClassName?: string;
  innerClassName?: string;
};

export function AdminDataTableFloatingBar({
  children,
  mode = "sticky",
  outerClassName,
  innerClassName,
}: AdminDataTableFloatingBarProps) {
  return (
    <div
      className={cn(
        mode === "sticky" ? "sticky bottom-4 flex justify-center" : "fixed inset-x-0 z-40 px-3",
        outerClassName,
      )}
    >
      <div
        className={cn(
          "rounded-xl border border-surface-border bg-card/95 shadow-lg",
          "animate-in fade-in slide-in-from-bottom-2 duration-200",
          innerClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
