"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type AdminFilterPopoverItem = {
  key: string;
  label: string;
  count?: number;
  content: ReactNode;
  contentClassName?: string;
};

type AdminFilterPopoversProps = {
  items: AdminFilterPopoverItem[];
  className?: string;
};

export function AdminFilterPopovers({ items, className }: AdminFilterPopoversProps) {
  return (
    <div className={className}>
      {items.map((item) => (
        <Popover key={item.key}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className={cn(
                "h-9 gap-1.5 text-sm",
                (item.count ?? 0) > 0
                  ? "border border-surface-border-strong bg-interactive-selected text-foreground hover:bg-interactive-selected"
                  : "text-muted-foreground hover:border hover:border-surface-border hover:text-foreground"
              )}
            >
              {item.label}
              {(item.count ?? 0) > 0 ? (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                  {item.count}
                </span>
              ) : null}
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={cn("w-56 p-3", item.contentClassName)} align="start">
            {item.content}
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}
