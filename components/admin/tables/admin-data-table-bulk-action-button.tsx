"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminDataTableBulkActionButtonProps = Readonly<{
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  className?: string;
}>;

export function AdminDataTableBulkActionButton({
  children,
  onClick,
  disabled = false,
  danger = false,
  className,
}: AdminDataTableBulkActionButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-7 shrink-0 whitespace-nowrap rounded-full px-3 text-xs shadow-none",
        danger && "border-destructive/30 text-destructive/70 hover:text-destructive/70",
        className
      )}
    >
      {children}
    </Button>
  );
}
