import type { ReactNode } from "react";

import { AdminFormActions } from "@/components/admin/forms/admin-form-actions";
import { cn } from "@/lib/utils";

type AdminFormFooterProps = Readonly<{
  children: ReactNode;
  className?: string;
  actionsClassName?: string;
  overlay?: boolean;
}>;

export function AdminFormFooter({
  children,
  className,
  actionsClassName,
  overlay = false,
}: AdminFormFooterProps) {
  return (
    <div
      className={cn(
        [
          "site-header-blur w-full",
          "border-t border-shell-border shadow-card",
          "px-4 pt-2 pb-1.5 md:px-6 md:pt-2.5 md:pb-2",
          "[@media(max-height:480px)]:py-1 ",
        ].join(" "),
        overlay ? "absolute bottom-0 left-0 right-0 z-20" : "shrink-0",
        className
      )}
    >
      <div className="flex w-full items-center">
        <AdminFormActions
          className={cn("flex w-full items-center justify-between gap-3", actionsClassName)}
        >
          {children}
        </AdminFormActions>
      </div>
    </div>
  );
}
