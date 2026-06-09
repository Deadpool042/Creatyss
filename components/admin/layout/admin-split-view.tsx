"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type CSSProperties, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { useAdminSplitViewState } from "./use-admin-split-view-state";

type AdminSplitViewProps = {
  list: ReactNode;
  detail: ReactNode;
  listRootPath: string;
  overviewPath?: string;
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
  mobileBackToListLabel?: string;
  compactSplit?: boolean;
};

export function AdminSplitView({
  list,
  detail,
  listRootPath,
  overviewPath,
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
  mobileBackToListLabel,
  compactSplit = false,
}: AdminSplitViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debugLayout = searchParams.get("debug-layout") === "1";
  const isOverviewActive = overviewPath ? pathname === overviewPath : false;
  const isDetailActive =
    isOverviewActive || (pathname !== listRootPath && pathname.startsWith(`${listRootPath}/`));

  const queryString = searchParams.toString();
  const mobileBackToListHref = queryString ? `${listRootPath}?${queryString}` : listRootPath;
  const debugOverlay = debugLayout ? (
    <div className="pointer-events-none absolute bottom-3 right-3 z-50 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-amber-500/40 bg-black/78 px-3 py-2 text-[11px] leading-5 text-amber-100 shadow-2xl backdrop-blur-xl">
      <div>path: {pathname}</div>
      <div>detailActive: {isDetailActive ? "true" : "false"}</div>
      <div>compactSplit: {compactSplit ? "true" : "false"}</div>
    </div>
  ) : null;

  const { desktopListWidth, desktopListCollapsed, toggleDesktopList, handleResizePointerDown } =
    useAdminSplitViewState({
      desktopResizable,
      desktopCollapsible,
      desktopStorageKey,
      defaultDesktopListWidth,
      minDesktopListWidth,
      maxDesktopListWidth,
    });

  const canCollapseDesktopList = desktopCollapsible;
  const showDesktopRail = canCollapseDesktopList && desktopListCollapsed;

  const splitListCSSVar = !desktopListCollapsed
    ? ({
        "--admin-split-list-width": `${desktopResizable ? desktopListWidth : defaultDesktopListWidth}px`,
      } as CSSProperties)
    : undefined;

  const splitClasses = compactSplit
    ? {
        listPanel:
          "tablet:pointer-events-auto tablet:absolute tablet:inset-0 tablet:relative tablet:inset-auto tablet:translate-x-0 tablet:min-h-0 tablet:shrink-0 tablet:flex tablet:overflow-hidden tablet:transition-[width,border-color] tablet:duration-(--motion-duration-panel) ",
        listPanelCollapsed: "tablet:w-12 tablet:border-r tablet:border-surface-border",
        listPanelExpanded:
          "w-full tablet:w-[var(--admin-split-list-width)] tablet:border-r tablet:border-surface-border",
        detailPanel:
          "tablet:pointer-events-auto tablet:absolute tablet:inset-0 tablet:relative tablet:inset-auto tablet:translate-x-0 tablet:min-h-0 tablet:flex tablet:flex-1 tablet:overflow-hidden",
        resizeHandle: "tablet:flex",
        mobileBackHidden: "tablet:hidden",
      }
    : {
        listPanel:
          "laptop:pointer-events-auto laptop:absolute laptop:inset-0 laptop:relative laptop:inset-auto laptop:translate-x-0 laptop:min-h-0 laptop:shrink-0 laptop:flex laptop:overflow-hidden laptop:transition-[width,border-color] laptop:duration-(--motion-duration-panel)",
        listPanelCollapsed: "laptop:w-12 laptop:border-r laptop:border-surface-border",
        listPanelExpanded:
          "w-full laptop:w-[var(--admin-split-list-width)] laptop:border-r laptop:border-surface-border ",
        detailPanel:
          "laptop:pointer-events-auto laptop:absolute laptop:inset-0 laptop:relative laptop:inset-auto laptop:translate-x-0 laptop:min-h-0 laptop:flex laptop:flex-1 laptop:overflow-hidden",
        resizeHandle: "laptop:flex",
        mobileBackHidden: "laptop:hidden",
      };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-visible laptop:overflow-hidden">
      {header ? (
        <div className="shrink-0 border-b border-surface-border bg-surface-panel/70 safe-px-layout py-2.5">
          {header}
        </div>
      ) : null}

      <div className="relative flex min-h-0 flex-1 flex-col overflow-visible md:flex-row laptop:overflow-hidden">
        {/* List panel — mobile: absolute slide, desktop: flex shrink-0 */}
        <div
          className={cn(
            "relative min-h-0 flex-col overflow-visible",
            isDetailActive ? "hidden" : "flex",
            splitClasses.listPanel,
            showDesktopRail ? splitClasses.listPanelCollapsed : splitClasses.listPanelExpanded,
            listClassName
          )}
          style={splitListCSSVar}
        >
          {canCollapseDesktopList ? (
            <button
              type="button"
              className={cn(
                "absolute bottom-3 z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-surface-border bg-surface-panel text-muted-foreground shadow-control backdrop-blur-xl transition-[transform,background-color,color,left,right] duration-(--motion-duration-panel) ease-(--motion-ease-spring) hover:bg-surface-floating hover:text-foreground lg:flex",
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
            className={cn(
              "relative hidden w-6 shrink-0 items-stretch justify-center bg-transparent",
              splitClasses.resizeHandle
            )}
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
            "relative min-h-0 flex-1 flex-col overflow-visible",
            isDetailActive ? "flex" : "hidden",
            splitClasses.detailPanel,
            detailClassName
          )}
        >
          {mobileBackToListLabel && isDetailActive ? (
            <Link
              href={mobileBackToListHref}
              className={cn(
                "admin-split-detail-mobile-backbar z-20 flex shrink-0 items-center gap-2 safe-px-layout py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                splitClasses.mobileBackHidden
              )}
            >
              <ChevronLeft className="size-4" />
              {mobileBackToListLabel}
            </Link>
          ) : null}
          {detail}
        </div>

        {debugOverlay}
      </div>
    </div>
  );
}
