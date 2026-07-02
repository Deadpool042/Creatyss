"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  ADMIN_SHIPPING_LIST_PATH,
  ADMIN_SHIPPING_SETTINGS_PATH,
} from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";

const SHIPPING_ROUTE_NAV_ITEMS = [
  { key: "list", label: "Liste", href: ADMIN_SHIPPING_LIST_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_SHIPPING_SETTINGS_PATH },
] as const;

export function ShippingRouteNav({ className }: Readonly<{ className?: string }>) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation livraisons"
      className={cn(
        "flex shrink-0 items-end gap-0 overflow-x-auto border-b border-surface-border/60 scrollbar-none",
        className
      )}
    >
      {SHIPPING_ROUTE_NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

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
