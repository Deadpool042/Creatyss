"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type ProductRouteNavItem = {
  key: string;
  label: string;
  href: string;
};

type ProductRouteNavProps = {
  items: ReadonlyArray<ProductRouteNavItem>;
  className?: string;
};

function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ProductRouteNav({ items, className }: ProductRouteNavProps) {
  const pathname = usePathname();

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Navigation produit"
      className={cn(
        "flex shrink-0 items-end gap-0 overflow-x-auto border-b border-surface-border/60 scrollbar-none",
        className
      )}
    >
      {items.map((item) => {
        const isActive = isRouteActive(pathname, item.href);

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-10 shrink-0 items-center border-b-2 px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "-mb-px border-brand text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
