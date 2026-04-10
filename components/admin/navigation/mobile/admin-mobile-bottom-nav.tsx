"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";

import type { AdminNavigationItem } from "@/features/admin/navigation";
import {
  AdminMobileMoreSheet,
  isAdminNavigationItemActive,
  renderAdminNavigationIcon,
} from "@/components/admin/navigation";
import { cn } from "@/lib/utils";

type AdminMobileBottomNavProps = {
  primaryItems: ReadonlyArray<AdminNavigationItem>;
  moreItems: ReadonlyArray<AdminNavigationItem>;
};

export function AdminMobileBottomNav({
  primaryItems,
  moreItems,
}: AdminMobileBottomNavProps): JSX.Element {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation mobile admin"
      className={[
        "site-header-blur fixed inset-x-0 bottom-0 z-30 border-t border-shell-border shadow-raised lg:hidden",
        "pb-[max(env(safe-area-inset-bottom),0px)]",
      ].join(" ")}
    >
      <div className="grid h-14 grid-cols-5 [@media(max-height:480px)]:h-11">
        {primaryItems.map((item) => {
          const active = isAdminNavigationItemActive(pathname, item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[11px] transition-colors",
                "[@media(max-height:480px)]:gap-0 [@media(max-height:480px)]:px-1 [@media(max-height:480px)]:text-[9px]",
                active
                  ? "bg-interactive-selected text-foreground"
                  : "text-muted-foreground hover:bg-interactive-hover hover:text-foreground"
              )}
            >
              {renderAdminNavigationIcon(item.iconKey, {
                className: cn(
                  "h-4 w-4 shrink-0",
                  "[@media(max-height:480px)]:h-3.5 [@media(max-height:480px)]:w-3.5",
                  active && "text-foreground"
                ),
              })}
              <span className="truncate leading-none">{item.label}</span>
            </Link>
          );
        })}

        <AdminMobileMoreSheet pathname={pathname} items={moreItems} />
      </div>
    </nav>
  );
}
