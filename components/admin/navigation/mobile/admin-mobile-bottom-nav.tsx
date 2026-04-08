// components/admin/navigation/mobile/admin-mobile-bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";

import {
  AdminMobileMoreSheet,
  adminMobilePrimaryNavigationItems,
  isAdminNavigationItemActive,
} from "@/components/admin/navigation";
import { cn } from "@/lib/utils";

export function AdminMobileBottomNav(): JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation mobile admin"
      className={[
        "site-header-blur fixed inset-x-0 bottom-0 z-30 border-t border-shell-border shadow-card lg:hidden",
        "pb-[max(env(safe-area-inset-bottom),0px)]",
      ].join(" ")}
    >
      <div className="grid h-14 grid-cols-5 [@media(max-height:480px)]:h-11">
        {adminMobilePrimaryNavigationItems.map((item) => {
          const active = isAdminNavigationItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-0.5 px-2 text-[11px] transition-colors",
                "[@media(max-height:480px)]:gap-0 [@media(max-height:480px)]:px-1 [@media(max-height:480px)]:text-[9px]",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  "[@media(max-height:480px)]:h-3.5 [@media(max-height:480px)]:w-3.5",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              />
              <span className="truncate leading-none">{item.label}</span>
            </Link>
          );
        })}

        <AdminMobileMoreSheet pathname={pathname} />
      </div>
    </nav>
  );
}
