import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";
import { CustomTooltip } from "@/components/shared/feedback";

type AdminSplitListItemProps = Readonly<
  Omit<ComponentPropsWithoutRef<typeof Link>, "className"> & {
    active: boolean;
    className?: string;
    tooltipContent?: ReactNode;
  }
>;

export function AdminSplitListItem({
  active,
  className,
  tooltipContent,
  title,
  ...props
}: AdminSplitListItemProps) {
  const resolvedTooltipContent = tooltipContent ?? (typeof title === "string" ? title : undefined);

  const link = (
    <Link
      aria-current={active ? "page" : undefined}
      title={title}
      className={cn(
        "block border-l-2 px-3 py-3 transition-colors",
        "outline-none focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 hover:border-l-brand rounded-xl",
        active
          ? "border-l-primary bg-interactive-selected"
          : "border-l-transparent hover:bg-interactive-hover",
        className
      )}
      {...props}
    />
  );

  if (!resolvedTooltipContent) {
    return link;
  }

  return (
    <CustomTooltip content={resolvedTooltipContent} side="right" align="start">
      {link}
    </CustomTooltip>
  );
}
