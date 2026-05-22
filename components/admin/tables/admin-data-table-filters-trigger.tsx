"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AdminDataTableFiltersTriggerProps = {
  label: string;
  activeLabel?: string;
  icon: LucideIcon;
  active?: boolean;
  ariaLabel?: string;
  onClick: () => void;
  className?: string;
  activeClassName?: string;
};

export function AdminDataTableFiltersTrigger({
  label,
  activeLabel,
  icon: Icon,
  active = false,
  ariaLabel,
  onClick,
  className,
  activeClassName,
}: AdminDataTableFiltersTriggerProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(className, active ? activeClassName : "text-muted-foreground")}
    >
      <Icon className="h-4 w-4" />
      <span>{active ? activeLabel ?? label : label}</span>
    </Button>
  );
}
