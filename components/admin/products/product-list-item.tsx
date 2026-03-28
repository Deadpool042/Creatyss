"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProductStatusBadge, type ProductStatus } from "./product-status-badge";
import Image from "next/image";

export type ProductListItemData = {
  id: string;
  slug: string;
  name: string;
  status: ProductStatus;
  imageUrl?: string;
  price?: string;
  shortDescription?: string;
  category?: string;
};

type ProductListItemProps = {
  product: ProductListItemData;
};

export function ProductListItem({ product }: ProductListItemProps) {
  const pathname = usePathname();

  // TODO(human): Implement active state detection and apply visual treatment
  // - Use pathname to detect if this item corresponds to the current route
  // - Set isActive = true when the current URL matches this product (details or edit page)
  // - Apply: left border indicator (absolute, w-0.5, bg-primary), bg-accent background, font-semibold
  const isActive = false;

  return (
    <Link
      href={`/admin/products/${product.slug}`}
      className={cn(
        "relative flex items-center gap-3 px-4 py-3 transition-colors",
        isActive ? "bg-accent" : "hover:bg-accent/50"
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-xs text-muted-foreground">–</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className={cn("truncate text-sm", isActive ? "font-semibold" : "font-medium")}>
          {product.name}
        </p>
        {product.price && <p className="truncate text-xs text-muted-foreground">{product.price}</p>}
      </div>

      <ProductStatusBadge status={product.status} className="shrink-0 text-xs" />
    </Link>
  );
}
