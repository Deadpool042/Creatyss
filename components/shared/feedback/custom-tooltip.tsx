"use client";

import type { ComponentProps, ReactNode } from "react";
import { CircleHelp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type CustomTooltipProps = Readonly<{
  content: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}> &
  Pick<ComponentProps<typeof TooltipContent>, "align" | "side" | "sideOffset">;

type InfoTooltipProps = Readonly<{
  content: ReactNode;
  label?: string;
  className?: string;
  iconClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}> &
  Pick<ComponentProps<typeof TooltipContent>, "align" | "side" | "sideOffset">;

export function CustomTooltip({
  content,
  children,
  className,
  contentClassName,
  align = "center",
  side = "top",
  sideOffset = 8,
  disabled = false,
}: CustomTooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild className={className}>
        {children}
      </TooltipTrigger>
      <TooltipContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export function InfoTooltip({
  content,
  label = "Afficher une information",
  className,
  iconClassName,
  contentClassName,
  align = "center",
  side = "top",
  sideOffset = 8,
  disabled = false,
}: InfoTooltipProps) {
  const icon = <CircleHelp aria-hidden className={cn("h-4 w-4", iconClassName)} />;

  if (disabled) {
    return (
      <span className={cn("inline-flex items-center text-muted-foreground", className)}>
        {icon}
      </span>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex items-center justify-center rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
            className
          )}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
