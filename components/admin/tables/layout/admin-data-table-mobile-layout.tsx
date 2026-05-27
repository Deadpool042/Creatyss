"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDataTableMobileLayoutProps = {
  toolbar: ReactNode;
  content: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function AdminDataTableMobileLayout({
  toolbar,
  content,
  className,
  contentClassName,
}: AdminDataTableMobileLayoutProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col lg:hidden", className)}>
      {toolbar}
      <div data-scroll-root="true" className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain py-2", contentClassName)}>
        {content}
      </div>
    </div>
  );
}
