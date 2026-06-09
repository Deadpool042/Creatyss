import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSplitDetailPaneShellProps = Readonly<{
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  constrainContent?: boolean;
}>;

export function AdminSplitDetailPaneShell({
  children,
  className,
  contentClassName,
  constrainContent = true,
}: AdminSplitDetailPaneShellProps) {
  return (
    <section
      className={cn(
        "admin-split-detail-pane-scroll flex min-h-0 flex-1 overflow-y-auto",
        className
      )}
    >
      <div
        className={cn(
          "admin-split-detail-pane-content safe-px-layout flex min-h-full flex-col gap-4 md:gap-6",
          constrainContent && "admin-split-detail-pane-column",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
