import type { ReactNode } from "react";

import type { AppBreadcrumbItem } from "@/components/shared/breadcrumbs";
import { AppBreadcrumbs } from "@/components/shared";
import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: ReadonlyArray<AppBreadcrumbItem>;
  className?: string;
  compact?: boolean;
  hideDescriptionOnMobile?: boolean;
  mobileHidden?: boolean;
};

export function AdminPageHeader({
  title,
  eyebrow,
  description,
  actions,
  breadcrumbs = [],
  className,
  compact = false,
  hideDescriptionOnMobile = false,
  mobileHidden = true,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col max-sm:landscape:gap-1",
        compact ? "gap-1 sm:gap-1.5" : "gap-1.5 sm:gap-2",
        mobileHidden && "hidden lg:block",
        className
      )}
    >
      {breadcrumbs.length > 0 ? (
        <AppBreadcrumbs
          items={breadcrumbs}
          className={cn(compact && "text-xs text-muted-foreground/85 ")}
        />
      ) : null}

      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-end sm:justify-between max-sm:landscape:gap-1.5",
          compact ? "gap-1.5 sm:gap-2" : "gap-2 sm:gap-3"
        )}
      >
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p
              className={cn(
                compact
                  ? "mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/90"
                  : "mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/85"
              )}
            >
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              "font-semibold tracking-tight leading-tight text-foreground",
              compact
                ? "text-[1.45rem] max-sm:landscape:text-[1.3rem] lg:text-[1.9rem]"
                : "text-[1.65rem] max-sm:landscape:text-[1.45rem] lg:text-[2.4rem]"
            )}
          >
            {title}
          </h1>

          {description ? (
            <p
              className={cn(
                compact
                  ? "mt-1 max-w-2xl text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-5"
                  : "mt-1.5 max-w-3xl text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6",
                hideDescriptionOnMobile && "hidden lg:block",
                "max-sm:landscape:hidden"
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {actions ? (
          <div className="w-full shrink-0 items-center sm:w-auto sm:justify-end hidden lg:flex">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
