"use client";

import type { ReactNode } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const ADMIN_VIEWPORT_SCROLL_AREA_CLASS_NAME = [
  "flex min-h-0 flex-col overflow-hidden",
  "h-[calc(100svh-8rem)]",
  "supports-[height:100dvh]:h-[calc(100dvh-8rem)]",
  "md:h-[calc(100svh-8.5rem)]",
  "md:supports-[height:100dvh]:h-[calc(100dvh-8.5rem)]",
  "lg:h-[calc(100svh-6.5rem)]",
  "lg:supports-[height:100dvh]:h-[calc(100dvh-6.5rem)]",
  "[@media(max-height:480px)]:h-[calc(100svh-6.75rem)]",
  "[@media(max-height:480px)]:supports-[height:100dvh]:h-[calc(100dvh-6.75rem)]",
].join(" ");

const SHEET_VIEWPORT_SCROLL_AREA_CLASS_NAME = [
  "flex min-h-0 flex-col overflow-hidden",
  "max-h-[85dvh]",
].join(" ");

type ViewportPreset = "admin" | "sheet" | "none";

type ViewportScrollAreaProps = Readonly<{
  header?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  scrollAreaClassName?: string;
  contentClassName?: string;
  viewportPreset?: ViewportPreset;
  scrollMode?: "area" | "nested";
}>;

export function ViewportScrollArea({
  header,
  children,
  className,
  headerClassName,
  bodyClassName,
  scrollAreaClassName,
  contentClassName,
  viewportPreset = "admin",
  scrollMode = "area",
}: ViewportScrollAreaProps) {
  const viewportPresetClassName =
    viewportPreset === "admin"
      ? ADMIN_VIEWPORT_SCROLL_AREA_CLASS_NAME
      : viewportPreset === "sheet"
        ? SHEET_VIEWPORT_SCROLL_AREA_CLASS_NAME
        : null;

  const body =
    scrollMode === "area" ? (
      <ScrollArea className={cn("min-h-0 flex-1", bodyClassName, scrollAreaClassName)}>
        <div className={cn("min-w-0 pr-1", contentClassName)}>{children}</div>
      </ScrollArea>
    ) : (
      <div className={cn("flex min-h-0 flex-1 flex-col", bodyClassName)}>{children}</div>
    );

  return (
    <div
      className={cn("flex min-h-0 flex-col overflow-hidden", viewportPresetClassName, className)}
    >
      {header ? <div className={cn("shrink-0", headerClassName)}>{header}</div> : null}
      {body}
    </div>
  );
}
