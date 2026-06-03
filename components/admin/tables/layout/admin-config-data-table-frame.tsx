"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminConfigDataTableFrameProps = {
  toolbar?: ReactNode;
  desktopContent: ReactNode;
  mobileContent: ReactNode;
  pagination?: ReactNode;
  floatingBar?: ReactNode;
  desktopClassName?: string;
  desktopContentClassName?: string;
  mobileClassName?: string;
  mobileContentClassName?: string;
};

export function AdminConfigDataTableFrame({
  toolbar,
  desktopContent,
  mobileContent,
  pagination,
  floatingBar,
  desktopClassName,
  desktopContentClassName,
  mobileClassName,
  mobileContentClassName,
}: AdminConfigDataTableFrameProps) {
  return (
    <>
      <div className={cn("hidden min-h-0 flex-1 flex-col gap-3 lg:flex", desktopClassName)}>
        {toolbar}
        <div className={cn("flex min-h-0 flex-1 flex-col", desktopContentClassName)}>
          {desktopContent}
        </div>
        {pagination}
        {floatingBar}
      </div>

      <div className={cn("flex min-h-0 flex-1 flex-col lg:hidden", mobileClassName)}>
        {toolbar}
        <div
          data-scroll-root="true"
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain py-2",
            mobileContentClassName
          )}
        >
          {mobileContent}
        </div>
      </div>
    </>
  );
}
