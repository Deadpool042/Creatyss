"use client";

import Link from "next/link";
import { ChevronRight, Menu } from "lucide-react";
import type { JSX } from "react";

import {
  adminMobileMoreNavigationItems,
  isAdminNavigationItemActive,
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
};

export function AdminMobileMoreSheet({ pathname }: AdminMobileMoreSheetProps): JSX.Element {
  const isMoreActive = adminMobileMoreNavigationItems.some((item) =>
    isAdminNavigationItemActive(pathname, item.href)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-full w-full rounded-none px-2"
          aria-label="Ouvrir plus d’options"
        >
          <span
            className={cn(
              "flex min-w-0 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors [@media(max-height:480px)]:text-[9px]",
              isMoreActive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Menu
              className={cn(
                "h-4 w-4 shrink-0 [@media(max-height:480px)]:h-3.5 [@media(max-height:480px)]:w-3.5",
                isMoreActive ? "text-foreground" : "text-muted-foreground"
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
        className={cn(
          "z-50 w-[min(18rem,calc(100vw-1rem))] rounded-2xl border border-border/60 bg-background/95 p-2 shadow-2xl backdrop-blur",
          "supports-backdrop-filter:bg-background/85"
        )}
      >
        <div className="mb-1 px-2 py-1">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Plus
          </p>
        </div>

        <div className="space-y-1">
          {adminMobileMoreNavigationItems.map((item) => {
            const active = isAdminNavigationItemActive(pathname, item.href);
            const Icon = item.icon;

            if (item.disabled) {
              return (
                <DropdownMenuItem
                  key={item.key}
                  disabled
                  className="rounded-xl px-3 py-3 opacity-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                        "border-border/60 bg-background/40 text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                      {item.label}
                    </span>

                    {item.badge ? (
                      <span className="inline-flex h-5 items-center rounded-full border border-border/70 bg-background/70 px-2 text-[10px] font-medium leading-none text-muted-foreground">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                </DropdownMenuItem>
              );
            }

            return (
              <DropdownMenuItem
                key={item.key}
                asChild
                className={cn(
                  "cursor-pointer rounded-xl p-0 focus:bg-background/70",
                  "data-highlighted:bg-background/70"
                )}
              >
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex min-w-0 items-center gap-3 px-3 py-3"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
                      active
                        ? "border-foreground/10 bg-foreground/8 text-foreground"
                        : "border-border/60 bg-background/40 text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                    {item.label}
                  </span>

                  {item.badge ? (
                    <span className="inline-flex h-5 items-center rounded-full border border-border/70 bg-background/70 px-2 text-[10px] font-medium leading-none text-muted-foreground">
                      {item.badge}
                    </span>
                  ) : null}

                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/80" />
                </Link>
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
