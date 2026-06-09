/**
 * Primitives d'aide contextuelle conservées volontairement.
 * Destinées aux aides locales interactives (admin, formulaires, champs complexes).
 * Ne pas supprimer sur simple grep de faible usage.
 * Suppression uniquement après audit UX/produit explicite.
 */
"use client";

import type { ComponentProps, ReactNode } from "react";
import { CircleHelp } from "lucide-react";

import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type CustomPopoverProps = Readonly<{
  content: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}> &
  Pick<ComponentProps<typeof PopoverContent>, "align" | "side" | "sideOffset">;

type InfoPopoverProps = Readonly<{
  content: ReactNode;
  label?: string;
  className?: string;
  iconClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
}> &
  Pick<ComponentProps<typeof PopoverContent>, "align" | "side" | "sideOffset">;

export function CustomPopover({
  content,
  children,
  className,
  contentClassName,
  align = "center",
  side = "bottom",
  sideOffset = 8,
  disabled = false,
}: CustomPopoverProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild className={className}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}

export function InfoPopover({
  content,
  label = "Afficher une information",
  className,
  iconClassName,
  contentClassName,
  align = "center",
  side = "bottom",
  sideOffset = 8,
  disabled = false,
}: InfoPopoverProps) {
  const icon = <CircleHelp aria-hidden className={cn("h-4 w-4", iconClassName)} />;

  if (disabled) {
    return (
      <span className={cn("inline-flex items-center text-muted-foreground", className)}>
        {icon}
      </span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}
