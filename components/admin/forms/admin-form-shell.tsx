import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeftSquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminFormFooter } from "./admin-form-footer";

type AdminFormShellProps = {
  backHref?: string;
  backLabel?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentClassName?: string;
};

export function AdminFormShell({
  backHref,
  backLabel,
  title,
  description,
  children,
  footer,
  contentClassName,
}: AdminFormShellProps) {
  const resolvedContentClassName =
    contentClassName ??
    [
      "mx-auto max-w-4xl space-y-4 px-3 pt-4",
      footer ? "pb-[calc(6.25rem+env(safe-area-inset-bottom))]" : "pb-4",
      "sm:space-y-5 sm:px-4 sm:pt-5",
      "md:space-y-6 md:px-6 md:pt-6",
      footer ? "md:pb-6" : "",
      "lg:px-5 xl:px-0",
      "[@media(max-height:480px)]:space-y-3",
      "[@media(max-height:480px)]:pt-3",
      footer
        ? "[@media(max-height:480px)]:pb-[calc(5.25rem+env(safe-area-inset-bottom))]"
        : "[@media(max-height:480px)]:pb-3",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.2rem] border border-surface-border bg-card shadow-sm sm:rounded-[1.4rem]">
      <div className="site-header-blur hidden shrink-0 border-b border-surface-border lg:block">
        <div className="px-6 py-5">
          {backHref && backLabel ? (
            <Button variant="outline" type="button" size="sm" asChild>
              <Link href={backHref} className="inline-flex items-center gap-2">
                <ChevronLeftSquareIcon className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          ) : null}

          {title ? <h2 className="mt-3 text-sm font-semibold">{title}</h2> : null}

          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className={resolvedContentClassName}>{children}</div>
      </div>

      {footer ? (
        <AdminFormFooter
          overlay
          actionsClassName="w-full justify-between gap-2 sm:w-auto sm:justify-end"
          className={[
            "px-3 py-2",
            "bottom-[calc(3.5rem+env(safe-area-inset-bottom))]",
            "[@media(max-height:480px)]:bottom-[calc(2.75rem+env(safe-area-inset-bottom))]",
            "sm:px-4 sm:py-3",
            "lg:bottom-0 lg:px-4 lg:py-3",
          ].join(" ")}
        >
          {footer}
        </AdminFormFooter>
      ) : null}
    </div>
  );
}
