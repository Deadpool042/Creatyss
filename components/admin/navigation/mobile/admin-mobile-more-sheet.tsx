"use client";

import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import type { JSX } from "react";

import type { AdminNavigationItem } from "@/features/admin/navigation";
import {
  isAdminNavigationItemActive,
  renderAdminNavigationIcon,
} from "@/components/admin/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AdminMobileMoreSheetProps = {
  pathname: string;
  items: ReadonlyArray<AdminNavigationItem>;
};

export function AdminMobileMoreSheet({ pathname, items }: AdminMobileMoreSheetProps): JSX.Element {
  const isMoreActive = items.some((item) => isAdminNavigationItemActive(pathname, item.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-full w-full rounded-none px-2 hover:bg-transparent"
          aria-label="Ouvrir plus d’options"
        >
          <span
            className={cn(
              "flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] transition-colors [@media(max-height:480px)]:px-2 [@media(max-height:480px)]:py-1 [@media(max-height:480px)]:text-[9px]",
              isMoreActive
                ? "bg-interactive-selected text-foreground"
                : "text-muted-foreground hover:bg-interactive-hover hover:text-foreground"
            )}
          >
            <Menu
              className={cn(
                "h-4 w-4 shrink-0 [@media(max-height:480px)]:h-3.5 [@media(max-height:480px)]:w-3.5",
                isMoreActive && "text-foreground"
              )}
            />
            <span className="truncate leading-none">Plus</span>
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="top"
        align="end"
        sideOffset={12}
        collisionPadding={12}
        className="z-50 w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-surface-border bg-popover p-2 shadow-overlay ring-0"
      >
        <div className="mb-1 px-2 py-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Plus
          </p>
        </div>

        <div className="space-y-1">
          {items.map((item) => {
            const active = isAdminNavigationItemActive(pathname, item.href);

            return (
              <DropdownMenuItem key={item.key} asChild className="cursor-pointer rounded-xl p-0">
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-w-0 items-center gap-3 rounded-xl px-3 py-3",
                    active && "bg-interactive-selected"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                      active
                        ? "border-surface-border-strong bg-interactive-selected text-foreground"
                        : "border-surface-border bg-surface-panel text-muted-foreground"
                    )}
                  >
                    {renderAdminNavigationIcon(item.iconKey, { className: "h-4 w-4" })}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {item.label}
                  </span>

                  {item.badge ? (
                    <span className="inline-flex h-5 items-center rounded-full border border-surface-border bg-surface-panel-soft px-2 text-[10px] font-medium leading-none text-muted-foreground">
                      {item.badge.label}
                    </span>
                  ) : null}

                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
