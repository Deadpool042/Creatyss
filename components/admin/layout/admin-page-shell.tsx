"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { AppBreadcrumbItem } from "@/components/shared/breadcrumbs";
import { AppBreadcrumbs } from "@/components/shared";
import { Button } from "@/components/ui/button";
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

  // Colonne uniquement quand une vraie liste de breadcrumbs doit pouvoir passer sous les
  // actions sur petit écran ; sans breadcrumbs (juste retour + action), une seule ligne suffit
  // et évite une bande à moitié vide sur mobile.
  const rowLayoutClassName = hasBreadcrumbs
    ? "flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
    : "flex-row items-center justify-between gap-2";

  return (
    <div className="shrink-0 border-b border-shell-border/60 bg-shell-surface/88 supports-backdrop-filter:bg-shell-surface/72 supports-backdrop-filter:backdrop-blur-xl ">
      <div
        className={cn(
          "safe-px-layout flex py-2.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:gap-1.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:py-1.5",
          rowLayoutClassName
        )}
      >
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
  return (
    <div
      className={cn(
        "min-h-0 flex-1",
        scrollBehavior === "page"
          ? "lg:overflow-y-auto lg:overscroll-contain"
          : "overflow-visible lg:overflow-hidden"
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col",
          scrollBehavior === "page" && "lg:min-h-full",
          // "external" : le parent (juste au-dessus) est borné en hauteur mais n'est pas un
          // conteneur flex (il porte overflow-hidden en display:block) — flex-1 n'a donc aucun
          // effet ici. Sans hauteur explicite, ce wrapper grandit avec son contenu (height:auto)
          // et le viewport de scroll interne (ex. table produits) ne reçoit jamais de hauteur
          // bornée, donc plus aucun scroll n'est possible au-delà de la première page visible.
          scrollBehavior === "external" && "lg:h-full",
          className
        )}
      >
        {children}
      </div>
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
  scrollBehavior = "page",
  contentPreset,
  className,
  contentClassName,
  showBreadcrumbsInContent = true,
  showTitleInContent = true,
}: AdminPageShellProps) {
  const resolvedContentClassName = cn(
    contentPreset ? getAdminContentClassName(contentPreset) : undefined,
    contentClassName
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <AdminPageContextBar
        breadcrumbs={breadcrumbs}
        navigation={navigation}
        topbarAction={topbarAction}
        showBreadcrumbs={showBreadcrumbsInContent}
      />

      <AdminPageTitleBlock title={title} header={header} showTitle={showTitleInContent} />

      <AdminPageContent scrollBehavior={scrollBehavior} className={resolvedContentClassName}>
        {children}
      </AdminPageContent>
    </div>
  );
}
