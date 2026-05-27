"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDataTableDesktopLayoutProps = {
  toolbar: ReactNode;
  content: ReactNode;
  pagination?: ReactNode;
  floatingBar?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function AdminDataTableDesktopLayout({
  toolbar,
  content,
  pagination,
  floatingBar,
  className,
  contentClassName,
}: AdminDataTableDesktopLayoutProps) {
  return (
    <div className={cn("hidden min-h-0 flex-1 flex-col gap-3 lg:flex", className)}>
      {toolbar}
      <div className={cn("min-h-0 flex-1", contentClassName)}>{content}</div>
      {pagination}
      {floatingBar}
    </div>
  );
}
