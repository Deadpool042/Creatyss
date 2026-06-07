"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

type UseAdminSplitViewStateArgs = {
  desktopResizable: boolean;
  desktopCollapsible: boolean;
  desktopStorageKey?: string | undefined;
  defaultDesktopListWidth: number;
  minDesktopListWidth: number;
  maxDesktopListWidth: number;
};

type UseAdminSplitViewStateResult = {
  desktopListWidth: number;
  desktopListCollapsed: boolean;
  openDesktopList: () => void;
  closeDesktopList: () => void;
  toggleDesktopList: () => void;
  handleResizePointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void;
};

export function useAdminSplitViewState({
  desktopResizable,
  desktopCollapsible,
  desktopStorageKey,
  defaultDesktopListWidth,
  minDesktopListWidth,
  maxDesktopListWidth,
}: UseAdminSplitViewStateArgs): UseAdminSplitViewStateResult {
  const storageEnabled = desktopResizable || desktopCollapsible;
  const storageKey = useMemo(
    () => (storageEnabled && desktopStorageKey ? `admin-split-view:${desktopStorageKey}` : null),
    [desktopStorageKey, storageEnabled]
  );
  const [desktopListWidth, setDesktopListWidth] = useState<number>(() => {
    if (!storageKey || typeof window === "undefined") return defaultDesktopListWidth;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return defaultDesktopListWidth;
      const parsed = JSON.parse(raw) as { width?: number; collapsed?: boolean };
      if (typeof parsed.width === "number") {
        return Math.min(maxDesktopListWidth, Math.max(minDesktopListWidth, parsed.width));
      }
    } catch {}
    return defaultDesktopListWidth;
  });
  const [desktopListCollapsed, setDesktopListCollapsed] = useState<boolean>(() => {
    if (!storageKey || typeof window === "undefined") return false;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return false;
      const parsed = JSON.parse(raw) as { width?: number; collapsed?: boolean };
      return parsed.collapsed === true;
    } catch {}
    return false;
  });
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        width: desktopListWidth,
        collapsed: desktopListCollapsed,
      })
    );
  }, [desktopListCollapsed, desktopListWidth, storageKey]);

  useEffect(() => {
    if (!desktopResizable) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      if (dragStateRef.current === null) {
        return;
      }

      const nextWidth =
        dragStateRef.current.startWidth + (event.clientX - dragStateRef.current.startX);
      setDesktopListWidth(
        Math.min(maxDesktopListWidth, Math.max(minDesktopListWidth, nextWidth))
      );
    }

    function handlePointerUp() {
      dragStateRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [desktopResizable, maxDesktopListWidth, minDesktopListWidth]);

  function handleResizePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    dragStateRef.current = {
      startX: event.clientX,
      startWidth: desktopListWidth,
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  return {
    desktopListWidth,
    desktopListCollapsed,
    openDesktopList: () => setDesktopListCollapsed(false),
    closeDesktopList: () => setDesktopListCollapsed(true),
    toggleDesktopList: () => setDesktopListCollapsed((value) => !value),
    handleResizePointerDown,
  };
}
