"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDataTableMobileStickyBarProps = {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
};

export function AdminDataTableMobileStickyBar({
  children,
  className,
  innerClassName,
}: AdminDataTableMobileStickyBarProps) {
  return (
    <div className={cn("h-13 lg:hidden [@media(max-height:480px)]:h-11", className)}>
      <div
        className={cn(
          "-mx-3 site-header-blur flex h-full items-center border-b border-shell-border px-3 shadow-card [@media(max-height:480px)]:-mx-2.5 [@media(max-height:480px)]:px-2.5",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
