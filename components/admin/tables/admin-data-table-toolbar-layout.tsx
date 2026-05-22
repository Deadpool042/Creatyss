"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDataTableToolbarLayoutProps = {
  toolbar: ReactNode;
  selection?: ReactNode;
  feedback?: ReactNode;
  activeFilters?: ReactNode;
  meta?: ReactNode;
  className?: string;
};

export function AdminDataTableToolbarLayout({
  toolbar,
  selection,
  feedback,
  activeFilters,
  meta,
  className,
}: AdminDataTableToolbarLayoutProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {selection}
      {feedback}
      {toolbar}
      {activeFilters}
      {meta}
    </div>
  );
}
