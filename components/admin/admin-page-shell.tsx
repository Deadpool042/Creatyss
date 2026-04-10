import Link from "next/link";
import type { ReactNode } from "react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPageTitle } from "@/components/admin/admin-page-title";
import type { AppBreadcrumbItem } from "@/components/shared/breadcrumbs";
import { ViewportScrollArea } from "@/components/shared/viewport-scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminPageShellLinkAction = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type AdminPageShellProps = {
  title: string;
  children: ReactNode;

  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: ReadonlyArray<AppBreadcrumbItem>;

  navigation?: AdminPageShellLinkAction;
  topbarAction?: ReactNode;
  pageTitleNavigation?: AdminPageShellLinkAction;
  pageTitleAction?: AdminPageShellLinkAction;
  mode?: "viewport";
  variant?: "tool";

  headerVisibility?: "all" | "desktop";
  scrollMode?: "area" | "nested";
  compactMobileTitle?: boolean;
  hideEyebrowOnLowHeight?: boolean;
  hideDescriptionOnMobile?: boolean;

  className?: string;
  viewportClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  contentClassName?: string;
};

export function AdminPageShell({
  title,
  children,
  eyebrow,
  description,
  actions,
  breadcrumbs = [],
  navigation,
  topbarAction,
  pageTitleNavigation,
  pageTitleAction,
  mode,
  variant,
  headerVisibility = "all",
  scrollMode = "nested",
  compactMobileTitle = false,
  hideEyebrowOnLowHeight = false,
  hideDescriptionOnMobile = false,
  className,
  viewportClassName,
  headerClassName,
  bodyClassName,
  contentClassName,
}: AdminPageShellProps) {
  const resolvedNavigation = navigation ?? pageTitleNavigation;
  const resolvedTopbarAction =
    topbarAction ??
    (pageTitleAction ? (
      <Button asChild size="sm" variant="outline">
        <Link
          href={pageTitleAction.href}
          aria-label={pageTitleAction.ariaLabel ?? pageTitleAction.label}
        >
          {pageTitleAction.label}
        </Link>
      </Button>
    ) : undefined);

  void mode;
  void variant;

  return (
    <>
      <AdminPageTitle
        title={title}
        {...(resolvedNavigation ? { navigation: resolvedNavigation } : {})}
        {...(resolvedTopbarAction ? { actionNode: resolvedTopbarAction } : {})}
      />

      <ViewportScrollArea
        className={cn(
          "gap-4 lg:gap-6 [@media(max-height:480px)]:gap-2",
          className,
          viewportClassName
        )}
        headerClassName={cn(
          "shrink-0 border-b border-surface-border p-4",
          headerVisibility === "desktop" &&
            "hidden lg:block lg:pt-16 [@media(max-height:480px)]:lg:pt-12",
          headerClassName
        )}
        bodyClassName={cn(
          "flex min-h-0 flex-1 flex-col",
          scrollMode === "nested" && "overflow-hidden",
          bodyClassName
        )}
        scrollMode={scrollMode}
        header={
          <AdminPageHeader
            actions={actions}
            breadcrumbs={breadcrumbs}
            compactMobileTitle={compactMobileTitle}
            description={description}
            eyebrow={eyebrow}
            hideDescriptionOnMobile={hideDescriptionOnMobile}
            hideEyebrowOnLowHeight={hideEyebrowOnLowHeight}
            title={title}
          />
        }
      >
        <div
          data-scroll-root="true"
          className={cn(
            scrollMode === "area"
              ? "flex min-h-full min-w-0 flex-col"
              : "flex min-h-0 flex-1 min-w-0 flex-col",
            scrollMode === "nested" && "overflow-hidden",
            contentClassName
          )}
        >
          {children}
        </div>
      </ViewportScrollArea>
    </>
  );
}
