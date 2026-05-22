"use client";

import type { ReactNode } from "react";

import { AdminSearchInput } from "./admin-search-input";
import { cn } from "@/lib/utils";

type AdminDataTableMobileTopbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  controls?: ReactNode;
  trailing?: ReactNode;
  className?: string;
  controlsClassName?: string;
};

export function AdminDataTableMobileTopbar({
  search,
  onSearchChange,
  placeholder = "Rechercher…",
  controls,
  trailing,
  className,
  controlsClassName,
}: AdminDataTableMobileTopbarProps) {
  return (
    <div className={cn("flex w-full items-center gap-2 [@media(max-height:480px)]:gap-1.5", className)}>
      <div className={cn("flex min-w-0 flex-1 items-center gap-2 [@media(max-height:480px)]:gap-1.5", controlsClassName)}>
        <AdminSearchInput
          value={search}
          onChange={onSearchChange}
          placeholder={placeholder}
          className="min-w-0 flex-1"
        />
        {controls}
      </div>
      {trailing}
    </div>
  );
}
