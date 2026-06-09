import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSplitDetailOverviewShellProps = Readonly<{
  title?: string;
  hero?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  contentWidth?: "constrained" | "fluid";
}>;

export function AdminSplitDetailOverviewShell({
  title,
  hero,
  children,
  contentClassName,
  contentWidth = "constrained",
}: AdminSplitDetailOverviewShellProps) {
  const shouldConstrainContent = contentWidth === "constrained";

  return (
    <section
      aria-label={title}
      className="admin-split-detail-pane-scroll admin-split-detail-pane-content safe-px-layout flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain pt-0 md:pt-3 lg:pt-5"
    >
      {hero ? (
        <div
          className={cn(
            "admin-split-detail-overview-hero -mx-(--safe-layout-inline-padding)",
            !shouldConstrainContent && "admin-split-detail-pane-fluid"
          )}
        >
          {hero}
        </div>
      ) : null}

      <div
        className={cn(
          "space-y-5",
          shouldConstrainContent
            ? "admin-split-detail-pane-column"
            : "admin-split-detail-pane-fluid",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}
