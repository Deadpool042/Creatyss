"use client";

import { ChevronLeft, ChevronRight, Expand, Shrink } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { useAdminSplitViewState } from "./use-admin-split-view-state";

function readViewport(): {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  landscape: boolean;
  coarsePointer: boolean;
  compactLandscape: boolean;
} {
  const visualWidth = window.visualViewport?.width ?? window.innerWidth;
  const visualHeight = window.visualViewport?.height ?? window.innerHeight;
  const landscapeByMedia = window.matchMedia?.("(orientation: landscape)").matches ?? false;
  const landscapeByScreen = window.screen.orientation?.type?.startsWith("landscape") ?? false;
  const landscapeByGeometry = visualWidth > visualHeight;
  const isLandscape = landscapeByMedia || landscapeByScreen || landscapeByGeometry;
  const isCoarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? true;

  return {
    width: visualWidth,
    height: visualHeight,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    landscape: isLandscape,
    coarsePointer: isCoarsePointer,
    compactLandscape: isLandscape && isCoarsePointer,
  };
}

function useViewportState(debugEnabled: boolean): {
  landscape: boolean;
  coarsePointer: boolean;
  compactLandscape: boolean;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
} {
  const [snapshot, setSnapshot] = useState({
    landscape: false,
    coarsePointer: false,
    compactLandscape: false,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  });

  useEffect(() => {
    const handleChange = () => {
      const next = readViewport();
      setSnapshot({
        landscape: next.landscape,
        coarsePointer: next.coarsePointer,
        compactLandscape: next.compactLandscape,
        width: next.width,
        height: next.height,
        innerWidth: debugEnabled ? next.innerWidth : 0,
        innerHeight: debugEnabled ? next.innerHeight : 0,
      });
    };

    handleChange();
    window.addEventListener("resize", handleChange);
    window.addEventListener("orientationchange", handleChange);
    window.visualViewport?.addEventListener("resize", handleChange);

    return () => {
      window.removeEventListener("resize", handleChange);
      window.removeEventListener("orientationchange", handleChange);
      window.visualViewport?.removeEventListener("resize", handleChange);
    };
  }, [debugEnabled]);

  return snapshot;
}

type CompactLandscapeDetailFocusShellProps = Readonly<{
  header?: ReactNode;
  detail: ReactNode;
  list: ReactNode;
  listClassName?: string | undefined;
  detailClassName?: string | undefined;
  isDetailActive: boolean;
  isDetailFocused: boolean;
  onDetailFocusToggle: () => void;
  viewportStyle?: CSSProperties | undefined;
  debugOverlay?: ReactNode;
}>;

function CompactLandscapeDetailFocusShell({
  header,
  detail,
  list,
  listClassName,
  detailClassName,
  isDetailActive,
  isDetailFocused,
  onDetailFocusToggle,
  viewportStyle,
  debugOverlay,
}: CompactLandscapeDetailFocusShellProps) {
  return (
    <div
      className="admin-split-compact-landscape-shell flex min-h-0 flex-1 flex-col overflow-visible"
      style={viewportStyle}
    >
      {header ? (
        <div className="admin-split-compact-landscape-header shrink-0 border-b border-surface-border bg-surface-panel/70 safe-px-layout py-2.5">
          {header}
        </div>
      ) : null}

      <div
        className="admin-split-compact-landscape-root relative flex min-h-0 flex-1 overflow-visible"
        data-detail-active={isDetailActive}
        data-detail-focused={isDetailFocused}
      >
        <div
          className={cn(
            "admin-split-compact-landscape-list safe-pb-mobile-nav flex min-h-0 flex-col overflow-visible border-r border-surface-border bg-surface-panel/70",
            isDetailFocused && "admin-split-compact-landscape-list--focused",
            listClassName
          )}
        >
          {list}
        </div>

        <div
          className={cn(
            "admin-split-compact-landscape-detail safe-pb-mobile-nav flex min-h-0 min-w-0 flex-1 flex-col overflow-visible border-surface-border bg-surface-panel",
            isDetailFocused && "admin-split-compact-landscape-detail--focused",
            detailClassName
          )}
        >
          {detail}
        </div>

        {isDetailActive ? (
          <button
            type="button"
            onClick={onDetailFocusToggle}
            aria-label={isDetailFocused ? "Réduire le détail" : "Agrandir le détail"}
            className="admin-split-focus-toggle absolute right-3 top-3 z-30 inline-flex size-11 items-center justify-center rounded-full border border-white/12 bg-surface-panel/80 text-foreground/80 shadow-[0_16px_30px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition-[transform,background-color,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95"
          >
            {isDetailFocused ? <Shrink className="size-4.5" /> : <Expand className="size-4.5" />}
          </button>
        ) : null}

        {debugOverlay}
      </div>
    </div>
  );
}

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
  compactLandscapeMode?: "none" | "detailFocus";
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
  compactLandscapeMode = "none",
}: AdminSplitViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debugLayout = searchParams.get("debug-layout") === "1";
  const viewport = useViewportState(debugLayout);
  const isCompactLandscapeDetailFocus =
    compactLandscapeMode === "detailFocus" && viewport.compactLandscape;
  const [isCompactLandscapeDetailFocused, setIsCompactLandscapeDetailFocused] = useState(false);
  const compactLandscapeViewportStyle = useMemo<CSSProperties | undefined>(() => {
    if (!isCompactLandscapeDetailFocus || viewport.width <= 0 || viewport.height <= 0) {
      return undefined;
    }

    const viewportWidth = viewport.width;
    const viewportHeight = viewport.height;
    const listWidth = Math.round(Math.max(208, Math.min(viewportWidth * 0.3, 300)));

    return {
      "--admin-compact-vw": `${viewportWidth}px`,
      "--admin-compact-vh": `${viewportHeight}px`,
      "--admin-split-compact-landscape-list-width": `${listWidth}px`,
    } as CSSProperties;
  }, [isCompactLandscapeDetailFocus, viewport.height, viewport.width]);
  const isOverviewActive = overviewPath ? pathname === overviewPath : false;
  const isDetailActive =
    isOverviewActive || (pathname !== listRootPath && pathname.startsWith(`${listRootPath}/`));

  const queryString = searchParams.toString();
  const mobileBackToListHref = queryString ? `${listRootPath}?${queryString}` : listRootPath;
  const debugOverlay = debugLayout ? (
    <div className="pointer-events-none absolute bottom-3 right-3 z-50 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-amber-500/40 bg-black/78 px-3 py-2 text-[11px] leading-5 text-amber-100 shadow-2xl backdrop-blur-xl">
      <div>path: {pathname}</div>
      <div>
        inner: {viewport.innerWidth} x {viewport.innerHeight}
      </div>
      <div>
        visual: {Math.round(viewport.width)} x {Math.round(viewport.height)}
      </div>
      <div>landscape: {viewport.landscape ? "true" : "false"}</div>
      <div>coarsePointer: {viewport.coarsePointer ? "true" : "false"}</div>
      <div>compactLandscape: {viewport.compactLandscape ? "true" : "false"}</div>
      <div>compactMode: {compactLandscapeMode}</div>
      <div>detailActive: {isDetailActive ? "true" : "false"}</div>
      <div>detailFocused: {isCompactLandscapeDetailFocused ? "true" : "false"}</div>
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

  if (isCompactLandscapeDetailFocus) {
    return (
      <CompactLandscapeDetailFocusShell
        key={pathname}
        header={header}
        detail={detail}
        list={list}
        listClassName={listClassName}
        detailClassName={detailClassName}
        isDetailActive={isDetailActive}
        isDetailFocused={isDetailActive && isCompactLandscapeDetailFocused}
        onDetailFocusToggle={() =>
          setIsCompactLandscapeDetailFocused((current) => (isDetailActive ? !current : false))
        }
        viewportStyle={compactLandscapeViewportStyle}
        debugOverlay={debugOverlay}
      />
    );
  }

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
