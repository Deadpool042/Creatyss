// components/admin/navigation/topbar/admin-topbar.tsx
"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { JSX } from "react";

import { useAdminPageTitle } from "@/components/admin/admin-page-title-context";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminTopbar(): JSX.Element {
  const { title, actionNode, navigation } = useAdminPageTitle();

  return (
    <header
      className={[
        "site-header-blur absolute top-0 left-0 right-0 z-20 border-b border-shell-border shadow-raised",
        "h-14 px-4 md:h-14 md:px-6",
        "[@media(max-height:480px)]:h-12 ",
      ].join(" ")}
    >
      <div className="relative flex h-full items-center">
        <div className="flex min-w-0 flex-1 items-center">
          <div className="hidden lg:flex [@media(max-height:480px)]:hidden">
            <SidebarTrigger className="-ml-1" />
          </div>

          {navigation ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="-ml-2 h-8 w-8 px-0 md:w-auto md:px-2.5 "
            >
              <Link
                href={navigation.href}
                aria-label={navigation.ariaLabel ?? navigation.label}
                className="inline-flex lg:hidden items-center gap-1.5 "
              >
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{navigation.label}</span>
              </Link>
            </Button>
          ) : null}
        </div>

        {title ? (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
            <p
              className={[
                "truncate text-sm font-medium tracking-tight text-foreground",
                navigation
                  ? "max-w-[44vw] md:max-w-[38vw] lg:max-w-none"
                  : "max-w-[55vw] md:max-w-none",
              ].join(" ")}
            >
              {title}
            </p>
          </div>
        ) : null}

        <div className="flex shrink-0 items-center gap-2">
          {actionNode}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
