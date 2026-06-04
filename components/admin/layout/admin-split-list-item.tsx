import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type AdminSplitListItemProps = Readonly<
  Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
    active: boolean;
    className?: string;
  }
>;

export function AdminSplitListItem({
  active,
  className,
  ...props
}: AdminSplitListItemProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={cn(
        "block border-l-2 px-3 py-3 transition-colors",
        "outline-none focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50",
        active
          ? "border-l-primary bg-interactive-selected"
          : "border-l-transparent hover:bg-interactive-hover",
        className
      )}
      {...props}
    />
  );
}
