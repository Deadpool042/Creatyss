"use client";

import Link from "next/link";
import { List, Settings2 } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type AdminSectionRouteNavItem = Readonly<{
  key: string;
  label: string;
  href: string;
}>;

type AdminSectionRouteNavProps = Readonly<{
  ariaLabel: string;
  items: ReadonlyArray<AdminSectionRouteNavItem>;
  className?: string | undefined;
  mobileVariant?: "tabs" | "settings-shortcut";
  isItemActive?: ((pathname: string, item: AdminSectionRouteNavItem) => boolean) | undefined;
  sectionLabel?: string | undefined;
}>;

function defaultIsItemActive(pathname: string, item: AdminSectionRouteNavItem): boolean {
  return pathname === item.href;
}

export function AdminSectionRouteNav({
  ariaLabel,
  items,
  className,
  mobileVariant = "tabs",
  isItemActive = defaultIsItemActive,
  sectionLabel,
}: AdminSectionRouteNavProps) {
  const pathname = usePathname();

  if (items.length === 0) {
    return null;
  }

  const activeItem = (items.find((item) => isItemActive(pathname, item)) ?? items[0])!;
  const settingsItem = (items.find((item) => item.key === "settings") ?? items[items.length - 1])!;
  const primaryItem = items[0]!;
  const mobileToggleTarget = activeItem.key === settingsItem.key ? primaryItem : settingsItem;
  const MobileToggleIcon = mobileToggleTarget.key === settingsItem.key ? Settings2 : List;

  return (
    <>
      <nav
        aria-label={ariaLabel}
        className={cn(
          "hidden shrink-0 items-end gap-0 overflow-x-auto border-b border-surface-border/60 scrollbar-none sm:flex",
          className
        )}
      >
        {items.map((item) => {
          const isActive = isItemActive(pathname, item);

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

      <div
        className={cn(
          "flex items-center justify-between gap-3 border-b border-surface-border/60 pb-3 sm:hidden",
          className
        )}
      >
        {mobileVariant === "settings-shortcut" ? (
          <>
            <div className="min-w-0">
              {sectionLabel ? (
                <div className="flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                  <span className="truncate">{sectionLabel}</span>
                  <span>/</span>
                  <span className="truncate text-foreground">{activeItem.label}</span>
                </div>
              ) : null}
            </div>

            <Button
              asChild
              type="button"
              variant={mobileToggleTarget.key === settingsItem.key ? "outline" : "default"}
              size="sm"
              className="rounded-full px-3 text-xs"
            >
              <Link href={mobileToggleTarget.href} aria-label={mobileToggleTarget.label}>
                <MobileToggleIcon className="size-4" />
                {mobileToggleTarget.label}
              </Link>
            </Button>
          </>
        ) : (
          <nav aria-label={ariaLabel} className="flex min-w-0 items-end gap-0 overflow-x-auto scrollbar-none">
            {items.map((item) => {
              const isActive = isItemActive(pathname, item);

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 shrink-0 items-center border-b-2 px-3 text-sm font-medium whitespace-nowrap transition-colors",
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
        )}
      </div>
    </>
  );
}
