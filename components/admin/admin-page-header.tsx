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
  compact?: boolean;
  compactMobileTitle?: boolean;
  hideEyebrowOnLowHeight?: boolean;
  hideDescriptionOnMobile?: boolean;
};

export function AdminPageHeader({
  title,
  eyebrow,
  description,
  actions,
  breadcrumbs = [],
  compact = false,
  compactMobileTitle = false,
  hideEyebrowOnLowHeight = false,
  hideDescriptionOnMobile = false,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col [@media(max-height:480px)]:gap-1",
        compact ? "gap-1 sm:gap-1.5" : "gap-1.5 sm:gap-2.5"
      )}
    >
      {breadcrumbs.length > 0 ? (
        <AppBreadcrumbs
          items={breadcrumbs}
          className={cn(compact && "text-xs text-muted-foreground/85")}
        />
      ) : null}

      <div
        className={cn(
          "flex flex-col sm:flex-row sm:items-end sm:justify-between [@media(max-height:480px)]:gap-1.5",
          compact ? "gap-1.5 sm:gap-2" : "gap-2 sm:gap-3"
        )}
      >
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p
              className={cn(
                compact
                  ? "mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/90"
                  : "mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary",
                hideEyebrowOnLowHeight && "[@media(max-height:480px)]:hidden"
              )}
            >
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              "font-semibold tracking-tight leading-tight text-foreground",
              compact ? "text-[1.5rem] lg:text-[2rem]" : "text-[1.75rem] lg:text-3xl",
              compactMobileTitle && "text-[1.4rem] sm:text-[1.75rem]"
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
                "[@media(max-height:480px)]:hidden"
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
