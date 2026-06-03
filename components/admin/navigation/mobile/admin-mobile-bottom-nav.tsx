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
        // Toujours caché sur desktop (lg:)
        // Caché en landscape compact (hauteur < 480px) — libère l'espace, évite la coupure
        "fixed inset-x-0 bottom-0 z-30 lg:hidden [@media(max-height:480px)]:hidden",
        // Portrait mobile uniquement : fond + bordure + blur
        "border-t border-shell-border/60 bg-shell-surface/92",
        // Safe-area : extension sous le home indicator iOS
        "pb-[env(safe-area-inset-bottom)]",
        // Backdrop blur pour adoucir la transition avec le contenu
        "supports-[backdrop-filter]:bg-shell-surface/78 supports-[backdrop-filter]:backdrop-blur-xl",
      ].join(" ")}
    >
      {/* Fondu doux au-dessus de la nav pour éviter la coupure nette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-full h-8 bg-gradient-to-t from-page-background/70 to-transparent"
      />

      <div className="grid h-14 grid-cols-5">
        {primaryItems.map((item) => {
          const active = isAdminNavigationItemActive(pathname, item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[11px] transition-colors",
                active
                  ? "bg-interactive-selected text-foreground"
                  : "text-text-muted-strong hover:bg-interactive-hover hover:text-foreground"
              )}
            >
              {renderAdminNavigationIcon(item.iconKey, {
                className: cn("h-4 w-4 shrink-0", active && "text-foreground"),
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
