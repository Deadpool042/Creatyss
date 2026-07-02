"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import {
  ADMIN_ORDERS_LIST_PATH,
  ADMIN_ORDERS_SETTINGS_PATH,
} from "@/features/admin/commerce/orders/shared/admin-orders-routes";

const ORDER_ROUTE_NAV_ITEMS = [
  { key: "list", label: "Liste", href: ADMIN_ORDERS_LIST_PATH },
  { key: "settings", label: "Configuration", href: ADMIN_ORDERS_SETTINGS_PATH },
] as const;

export function OrderRouteNav({ className }: Readonly<{ className?: string }>) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation commandes"
      className={cn(
        "flex shrink-0 items-end gap-0 overflow-x-auto safe-px-layout scrollbar-none",
        className
      )}
    >
      {ORDER_ROUTE_NAV_ITEMS.map((item) => {
        const isActive =
          item.key === "list"
            ? pathname === item.href ||
              (pathname.startsWith(`${item.href}/`) && pathname !== ADMIN_ORDERS_SETTINGS_PATH)
            : pathname === item.href;

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-9 shrink-0 items-center border-b-2 px-3.5 text-sm font-medium whitespace-nowrap transition-colors",
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
