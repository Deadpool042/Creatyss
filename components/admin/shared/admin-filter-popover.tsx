"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type AdminFilterPopoverProps = {
  label: string;
  count: number;
  children: ReactNode;
  contentClassName?: string;
};

export function AdminFilterPopover({
  label,
  count,
  children,
  contentClassName,
}: AdminFilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          className={cn(
            "h-9 gap-1.5 text-sm",
            count > 0
              ? "border-surface-border-strong bg-interactive-selected text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
          {count > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
              {count}
            </span>
          )}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-56 p-3", contentClassName)} align="start">
        {children}
      </PopoverContent>
    </Popover>
  );
}
