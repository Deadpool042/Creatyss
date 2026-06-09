"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { AppBreadcrumbItem } from "@/components/shared/breadcrumbs";
import { AppBreadcrumbs } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

import { getAdminContentClassName, type AdminContentPreset } from "./admin-content-classnames";
import { AdminPageHeader } from "./admin-page-header";

type AdminPageShellLinkAction = Readonly<{
  label: string;
  href: string;
  ariaLabel?: string;
}>;

type AdminPageScrollBehavior = "page" | "external";

type AdminPageShellProps = Readonly<{
  title: string;
  children: ReactNode;
  header?: ReactNode;
  navigation?: AdminPageShellLinkAction;
  topbarAction?: ReactNode;
  breadcrumbs?: ReadonlyArray<AppBreadcrumbItem>;
  /** "page": this shell owns the vertical scroll. "external": a parent owns scrolling. */
  scrollBehavior?: AdminPageScrollBehavior;
  contentPreset?: AdminContentPreset;
  className?: string;
  contentClassName?: string;
  showBreadcrumbsInContent?: boolean;
  showTitleInContent?: boolean;
}>;

type AdminPageContextBarProps = Readonly<{
  breadcrumbs?: ReadonlyArray<AppBreadcrumbItem> | undefined;
  navigation?: AdminPageShellLinkAction | undefined;
  topbarAction?: ReactNode;
  showBreadcrumbs: boolean;
}>;

type AdminPageTitleBlockProps = Readonly<{
  title: string;
  header?: ReactNode;
  showTitle: boolean;
}>;

type AdminPageContentProps = Readonly<{
  children: ReactNode;
  scrollBehavior: AdminPageScrollBehavior;
  className?: string;
}>;

function resolveScrollBehavior(scrollBehavior?: AdminPageScrollBehavior): AdminPageScrollBehavior {
  return scrollBehavior ?? "page";
}

function AdminPageContextBar({
  breadcrumbs,
  navigation,
  topbarAction,
  showBreadcrumbs,
}: AdminPageContextBarProps) {
  const hasBreadcrumbs = showBreadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0;
  const hasContextBar = Boolean(hasBreadcrumbs || navigation || topbarAction);

  if (!hasContextBar) {
    return null;
  }

  return (
    <div className="shrink-0 border-b border-shell-border/60 bg-shell-surface/88 supports-backdrop-filter:bg-shell-surface/72 supports-backdrop-filter:backdrop-blur-xl">
      <div className="safe-px-layout flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:gap-1.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:py-1.5">
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          {navigation ? <AdminPageBackLink navigation={navigation} /> : null}

          {hasBreadcrumbs ? (
            <div className="min-w-0 flex-1 overflow-x-auto scrollbar-none">
              <AppBreadcrumbs items={breadcrumbs} className="text-muted-foreground/72" />
            </div>
          ) : null}
        </div>

        {topbarAction ? (
          <div className="flex shrink-0 items-center justify-end">{topbarAction}</div>
        ) : null}
      </div>
    </div>
  );
}

function AdminPageBackLink({ navigation }: Readonly<{ navigation: AdminPageShellLinkAction }>) {
  return (
    <Button
      asChild
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 shrink-0 gap-1 rounded-xl px-2 text-foreground/72 hover:text-foreground"
    >
      <Link href={navigation.href} aria-label={navigation.ariaLabel ?? navigation.label}>
        <ChevronLeft className="size-4 shrink-0" />
        <span className="hidden sm:inline">{navigation.label}</span>
      </Link>
    </Button>
  );
}

function AdminPageTitleBlock({ title, header, showTitle }: AdminPageTitleBlockProps) {
  if (!showTitle && !header) {
    return null;
  }

  return (
    <div className="shrink-0">
      {showTitle ? (
        <AdminPageHeader
          title={title}
          compact
          mobileHidden={false}
          className={cn(
            "safe-px-layout pt-4 md:pt-5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:pt-3",
            header && "lg:hidden"
          )}
        />
      ) : null}
      {header}
    </div>
  );
}

function AdminPageContent({ children, scrollBehavior, className }: AdminPageContentProps) {
  if (scrollBehavior === "page") {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className={cn("flex min-h-full min-w-0 flex-col", className)}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-visible lg:overflow-hidden", className)}
    >
      {children}
    </div>
  );
}

export function AdminPageShell({
  title,
  children,
  header,
  navigation,
  topbarAction,
  breadcrumbs,
  scrollBehavior,
  contentPreset = "none",
  className,
  contentClassName,
  showBreadcrumbsInContent = true,
  showTitleInContent = true,
}: AdminPageShellProps) {
  const isMobile = useIsMobile();
  const resolvedScrollBehavior = resolveScrollBehavior(scrollBehavior);
  const effectiveScrollBehavior = isMobile ? "external" : resolvedScrollBehavior;
  const resolvedContentClassName = cn(getAdminContentClassName(contentPreset), contentClassName);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <AdminPageContextBar
        breadcrumbs={breadcrumbs}
        navigation={navigation}
        topbarAction={topbarAction}
        showBreadcrumbs={showBreadcrumbsInContent}
      />

      <AdminPageTitleBlock title={title} header={header} showTitle={showTitleInContent} />

      <AdminPageContent
        scrollBehavior={effectiveScrollBehavior}
        className={resolvedContentClassName}
      >
        {children}
      </AdminPageContent>
    </div>
  );
}
