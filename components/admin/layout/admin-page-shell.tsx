"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

import type { AppBreadcrumbItem } from "@/components/shared/breadcrumbs";
import { AppBreadcrumbs } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { getAdminContentClassName, type AdminContentPreset } from "./admin-content-classnames";
import { AdminPageHeader } from "./admin-page-header";

type AdminPageShellLinkAction = {
  label: string;
  href: string;
  ariaLabel?: string;
};

type AdminPageShellProps = {
  title: string;
  children: ReactNode;
  header?: ReactNode;
  navigation?: AdminPageShellLinkAction;
  topbarAction?: ReactNode;
  breadcrumbs?: ReadonlyArray<AppBreadcrumbItem>;
  /** "area" = scroll natif overflow-y-auto. "nested" = pas de scroll propre (split view panels). */
  scrollMode?: "area" | "nested";
  contentPreset?: AdminContentPreset;
  className?: string;
  contentClassName?: string;
  showBreadcrumbsInContent?: boolean;
  showTitleInContent?: boolean;
};

export function AdminPageShell({
  title,
  children,
  header,
  navigation,
  topbarAction,
  breadcrumbs,
  scrollMode = "nested",
  contentPreset = "none",
  className,
  contentClassName,
  showBreadcrumbsInContent = true,
  showTitleInContent = true,
}: AdminPageShellProps) {
  const isMobile = useIsMobile();
  const showContextBreadcrumbs =
    showBreadcrumbsInContent && Array.isArray(breadcrumbs) && breadcrumbs.length > 0;
  const hasContextBar = Boolean(showContextBreadcrumbs || navigation || topbarAction);
  const effectiveScrollMode = isMobile ? "nested" : scrollMode;

  const shellHeader = header ? (
    <>
      {showTitleInContent && title ? (
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
    </>
  ) : showTitleInContent && title ? (
    <AdminPageHeader
      title={title}
      compact
      mobileHidden={false}
      className="safe-px-layout pt-4 md:pt-5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:pt-3"
    />
  ) : undefined;

  const resolvedContentClassName = cn(getAdminContentClassName(contentPreset), contentClassName);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col ", className)}>
      {hasContextBar ? (
        <div className="shrink-0 border-b border-shell-border/60 bg-shell-surface/88 supports-backdrop-filter:bg-shell-surface/72 supports-backdrop-filter:backdrop-blur-xl">
          <div className="safe-px-layout flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:justify-between [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:gap-1.5 [@media(pointer:coarse)_and_(orientation:landscape)_and_(max-height:480px)]:py-1.5">
            <div className="flex min-w-0 items-center gap-2 overflow-hidden">
              {navigation ? (
                <Button
                  asChild
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 shrink-0 gap-1 rounded-xl px-2 text-foreground/72 hover:text-foreground"
                >
                  <Link
                    href={navigation.href}
                    aria-label={navigation.ariaLabel ?? navigation.label}
                  >
                    <ChevronLeft className="size-4 shrink-0" />
                    <span className="hidden sm:inline">{navigation.label}</span>
                  </Link>
                </Button>
              ) : null}

              {showContextBreadcrumbs ? (
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
      ) : null}

      {shellHeader ? <div className="shrink-0">{shellHeader}</div> : null}

      {effectiveScrollMode === "area" ? (
        // ── "area" : ce div est le scroll container réel ──────────────────
        // overflow-y-auto ici → c'est CE div (pas le document) qui scrolle.
        // overscroll-contain isole le rebond iOS du parent.
        // Obligatoire sur desktop (SidebarInset est overflow-hidden) : sans
        // ce scroll local le contenu plus grand que la viewport est clippé.
        // À utiliser pour : pages standards, formulaires, listes, dashboard.
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className={cn("flex min-h-full min-w-0 flex-col", resolvedContentClassName)}>
            {children}
          </div>
        </div>
      ) : (
        // ── "nested" : aucun scroll propre — le parent gère ───────────────
        // overflow-hidden → le contenu est clippé si aucun parent ne scrolle.
        // Réserver à : split-view panels, tableaux avec scroll interne, panneaux
        // où l'enfant contrôle lui-même son overflow-y-auto.
        // ⚠️  Sur desktop avec SidebarInset overflow-hidden + aucun ancêtre
        //     overflow-y-auto → le contenu est silencieusement clippé.
        //     Préférer "area" par défaut sauf besoin explicite de "nested".
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-visible lg:overflow-hidden",
            resolvedContentClassName
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
