"use client";

import type { JSX } from "react";

import { toggleProductFeaturedAction } from "@/features/admin/products/list/actions";
import { cn } from "@/lib/utils";
import { ProductFeaturedToggle } from "../../product-featured-toggle";

type ProductCardFeaturedControlProps = {
  productId: string;
  isFeatured: boolean;
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
};

export function ProductCardFeaturedControl({
  productId,
  isFeatured,
  className,
  buttonClassName,
  iconClassName,
}: ProductCardFeaturedControlProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-full bg-transparent p-0",
        className
      )}
    >
      <ProductFeaturedToggle
        productId={productId}
        isFeatured={isFeatured}
        onToggle={toggleProductFeaturedAction}
        {...(buttonClassName ? { className: buttonClassName } : {})}
        {...(iconClassName ? { iconClassName } : {})}
      />
    </div>
  );
}
