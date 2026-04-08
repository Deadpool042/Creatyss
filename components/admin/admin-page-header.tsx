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
  compactMobileTitle = false,
  hideEyebrowOnLowHeight = false,
  hideDescriptionOnMobile = false,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2.5 [@media(max-height:480px)]:gap-1">
      {breadcrumbs.length > 0 ? <AppBreadcrumbs items={breadcrumbs} /> : null}

      <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-end sm:justify-between [@media(max-height:480px)]:gap-1.5">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p
              className={cn(
                "mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary",
                hideEyebrowOnLowHeight && "[@media(max-height:480px)]:hidden"
              )}
            >
              {eyebrow}
            </p>
          ) : null}

          <h1
            className={cn(
              "font-semibold tracking-tight leading-tight text-foreground text-[1.75rem] lg:text-3xl",
              compactMobileTitle && "text-[1.4rem] sm:text-[1.75rem]"
            )}
          >
            {title}
          </h1>

          {description ? (
            <p
              className={cn(
                "mt-1.5 max-w-3xl text-sm leading-5 text-muted-foreground sm:text-base sm:leading-6",
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
