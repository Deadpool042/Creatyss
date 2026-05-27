import { MoreHorizontal } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AdminRowActionsMenuProps = Readonly<{
  label: string;
  children: ReactNode;
  triggerVariant?: ComponentProps<typeof Button>["variant"];
  triggerSize?: ComponentProps<typeof Button>["size"];
  triggerClassName?: string;
  triggerIconClassName?: string;
  contentClassName?: string;
  contentSideOffset?: number;
}>;

export function AdminRowActionsMenu({
  label,
  children,
  triggerVariant = "outline",
  triggerSize = "icon-sm",
  triggerClassName,
  triggerIconClassName,
  contentClassName,
  contentSideOffset,
}: AdminRowActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          type="button"
          className={cn(
            "text-text-muted-strong data-[state=open]:border-control-border-strong data-[state=open]:bg-control-surface-selected data-[state=open]:text-foreground",
            triggerClassName
          )}
          aria-label={label}
        >
          <MoreHorizontal className={cn("h-4 w-4", triggerIconClassName)} />
          <span className="sr-only">{label}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        {...(contentSideOffset === undefined ? {} : { sideOffset: contentSideOffset })}
        className={contentClassName}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
