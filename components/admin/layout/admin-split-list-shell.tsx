import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminSplitListShellProps = Readonly<{
  header?: ReactNode;
  children: ReactNode;
  className?: string | undefined;
  scrollClassName?: string | undefined;
  contentClassName?: string | undefined;
}>;

export function AdminSplitListShell({
  header,
  children,
  className,
  scrollClassName,
  contentClassName,
}: AdminSplitListShellProps) {
  return (
    <section className={cn("flex min-h-0 flex-1 flex-col space-y-2", className)}>
      <div
        className={cn(
          "admin-split-list-pane-scroll min-h-0 flex-1 overscroll-contain",
          scrollClassName
        )}
      >
        {header !== undefined ? <div>{header}</div> : null}
        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
