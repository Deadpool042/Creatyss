"use client";

import type { JSX, ReactNode } from "react";

import { ProductSectionEyebrow } from "@/features/admin/products/components/shared";
import { cn } from "@/lib/utils";

type ProductCardInfoTileProps = {
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
  bodyClassName?: string;
};

export function ProductCardInfoTile({
  label,
  children,
  className,
  labelClassName,
  bodyClassName,
}: ProductCardInfoTileProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-lg border border-surface-border/70 bg-background/35 px-2.5 py-2.5",
        className
      )}
    >
      <ProductSectionEyebrow className={cn("text-[10px] tracking-[0.12em]", labelClassName)}>
        {label}
      </ProductSectionEyebrow>

      <div className={cn("mt-1 min-h-7 text-sm", bodyClassName)}>{children}</div>
    </div>
  );
}
