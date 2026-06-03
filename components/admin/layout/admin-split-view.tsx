"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { useAdminSplitViewState } from "./use-admin-split-view-state";

type AdminSplitViewProps = {
  list: ReactNode;
  detail: ReactNode;
  listRootPath: string;
  header?: ReactNode;
  listClassName?: string;
  detailClassName?: string;
  desktopResizable?: boolean;
  desktopCollapsible?: boolean;
  desktopStorageKey?: string;
  defaultDesktopListWidth?: number;
  minDesktopListWidth?: number;
  maxDesktopListWidth?: number;
  collapseLabel?: string;
  expandLabel?: string;
  resizeLabel?: string;
};

export function AdminSplitView({
  list,
  detail,
  listRootPath,
  header,
  listClassName,
  detailClassName,
  desktopResizable = false,
  desktopCollapsible = false,
  desktopStorageKey,
  defaultDesktopListWidth = 320,
  minDesktopListWidth = 272,
  maxDesktopListWidth = 440,
  collapseLabel = "Réduire la liste",
  expandLabel = "Ouvrir la liste",
  resizeLabel = "Redimensionner la liste",
}: AdminSplitViewProps) {
  const pathname = usePathname();
  const isDetailActive = pathname !== listRootPath && pathname.startsWith(`${listRootPath}/`);

  const { desktopListWidth, desktopListCollapsed, toggleDesktopList, handleResizePointerDown } =
    useAdminSplitViewState({
      desktopResizable,
      desktopStorageKey,
      defaultDesktopListWidth,
      minDesktopListWidth,
      maxDesktopListWidth,
    });

  const canCollapseDesktopList = desktopCollapsible;
  const showDesktopRail = canCollapseDesktopList && desktopListCollapsed;

  const desktopListStyle =
    !desktopListCollapsed && desktopResizable
      ? { width: `${desktopListWidth}px` }
      : !desktopListCollapsed
        ? { width: `${defaultDesktopListWidth}px` }
        : undefined;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {header ? (
        <div className="shrink-0 border-b border-surface-border bg-surface-panel/70 px-4 py-2.5 lg:px-6">
          {header}
        </div>
      ) : null}

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* List panel — mobile: absolute slide, desktop: flex shrink-0 */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col overflow-hidden",
            "transition-transform duration-(--motion-duration-panel) ease-(--motion-ease-spring)",
            isDetailActive ? "pointer-events-none -translate-x-full" : "translate-x-0",
            "lg:pointer-events-auto lg:relative lg:inset-auto lg:translate-x-0",
            "lg:min-h-0 lg:shrink-0 lg:transition-[width,border-color] lg:duration-(--motion-duration-panel)",
            showDesktopRail
              ? "lg:w-12 lg:border-r lg:border-surface-border"
              : "lg:border-r lg:border-surface-border",
            listClassName
          )}
          style={desktopListStyle}
        >
          {canCollapseDesktopList ? (
            <button
              type="button"
              className={cn(
                "absolute top-3 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-surface-border bg-surface-panel text-muted-foreground shadow-control backdrop-blur-xl transition-[transform,background-color,color,left,right] duration-(--motion-duration-panel) ease-(--motion-ease-spring) hover:bg-surface-floating hover:text-foreground lg:flex",
                showDesktopRail ? "left-1/2 -translate-x-1/2" : "right-3"
              )}
              onClick={toggleDesktopList}
              aria-label={desktopListCollapsed ? expandLabel : collapseLabel}
            >
              {desktopListCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          ) : null}

          <div className={cn("min-h-0 flex-1 flex-col", showDesktopRail ? "hidden" : "flex")}>
            {list}
          </div>
        </div>

        {/* Resize handle — desktop only */}
        {desktopResizable ? (
          <div
            role="separator"
            aria-orientation="vertical"
            className="relative hidden w-6 shrink-0 items-stretch justify-center bg-transparent lg:flex"
          >
            {!showDesktopRail ? (
              <button
                type="button"
                aria-label={resizeLabel}
                className="group flex w-full items-stretch justify-center"
                onPointerDown={handleResizePointerDown}
              >
                <span className="my-2.5 w-px rounded-full bg-surface-border transition-colors group-hover:bg-foreground/30" />
              </button>
            ) : (
              <span className="mx-auto my-2.5 w-px flex-1 rounded-full bg-surface-border-subtle" />
            )}
          </div>
        ) : null}

        {/* Detail panel — mobile: absolute slide, desktop: flex flex-1 */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col overflow-hidden",
            "transition-transform duration-(--motion-duration-panel) ease-(--motion-ease-spring)",
            isDetailActive ? "translate-x-0" : "pointer-events-none translate-x-full",
            "lg:pointer-events-auto lg:relative lg:inset-auto lg:translate-x-0",
            "lg:min-h-0 lg:flex-1 lg:overflow-hidden",
            detailClassName
          )}
        >
          {detail}
        </div>
      </div>
    </div>
  );
}
