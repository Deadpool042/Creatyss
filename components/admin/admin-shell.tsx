//components/admin/admin-shell.tsx
"use client";

import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

type AdminShellProps = {
  children: ReactNode;
  displayName: string;
  email: string;
};

export function AdminShell({ children, displayName, email }: AdminShellProps) {
  return (
    <div
      data-admin-shell="true"
      className="-mb-16 -mt-8">
      <SidebarProvider
        className="h-[calc(100svh-3.5rem)] min-h-0 md:h-[calc(100svh-4rem)]"
        open={true}
        onOpenChange={() => undefined}>
        <AdminSidebar
          className="top-14 h-[calc(100svh-3.5rem)] md:top-16 md:h-[calc(100svh-4rem)]"
          displayName={displayName}
          email={email}
        />

        <SidebarInset className="h-full overflow-hidden bg-muted/20">
          <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-6">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <SidebarTrigger className="-ml-1 md:hidden" />
              <Separator
                orientation="vertical"
                className="h-4 md:hidden"
              />

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f5d2d]">
                  Administration
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  Espace interne Creatyss
                </p>
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
