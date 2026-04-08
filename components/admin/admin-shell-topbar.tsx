"use client";

import { ModeToggle } from "@/components/shared/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdminPageTitle } from "./admin-page-title-context";

export function AdminShellTopbar() {
  const { title } = useAdminPageTitle();

  return (
    <header
      className={[
        "sticky top-0 z-20 shrink-0 border-b bg-background/95 backdrop-blur",
        "supports-backdrop-filter:bg-background/80",
        "h-14 px-4 md:h-14 md:px-6",
        "[@media(max-height:480px)]:h-12",
      ].join(" ")}
    >
      <div className="relative flex h-full items-center">
        <div className="flex min-w-0 flex-1 items-center">
          <SidebarTrigger className="-ml-1" />
        </div>

        {title ? (
          <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 md:hidden  ">
            <p className="max-w-[55vw] truncate text-sm font-medium text-foreground ">{title}</p>
          </div>
        ) : null}

        <div className="shrink-0">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
