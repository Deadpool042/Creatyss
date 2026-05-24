import type { JSX, PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ProductSectionEyebrowProps = PropsWithChildren<{
  className?: string;
}>;

export function ProductSectionEyebrow({
  children,
  className,
}: ProductSectionEyebrowProps): JSX.Element {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground",
        className
      )}
    >
      {children}
    </p>
  );
}
