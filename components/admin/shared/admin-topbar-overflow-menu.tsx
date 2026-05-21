"use client";

import { MoreHorizontal } from "lucide-react";
import type { JSX, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type AdminTopbarOverflowMenuProps = Readonly<{
  ariaLabel: string;
  disabled?: boolean;
  children: ReactNode;
  contentClassName?: string;
}>;

export function AdminTopbarOverflowMenu({
  ariaLabel,
  disabled = false,
  children,
  contentClassName = "w-56",
}: AdminTopbarOverflowMenuProps): JSX.Element {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
          className="h-9 w-9 rounded-full"
          disabled={disabled}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className={contentClassName}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
