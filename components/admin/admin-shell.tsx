//components/admin/admin-shell.tsx
import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ModeToggle } from "../shared/mode-toggle";

type AdminShellProps = {
  children: ReactNode;
  displayName: string;
  email: string;
};

export function AdminShell({ children, displayName, email }: AdminShellProps) {
  return (
    <SidebarProvider
      data-admin-shell="true"
      className="h-svh">
      <AdminSidebar
        displayName={displayName}
        email={email}
      />

      <SidebarInset className="overflow-hidden bg-muted/20">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/80 md:px-6">
          <div className="flex min-w-0 flex-1 items-center">
            <SidebarTrigger className="-ml-1" />
          </div>
          <ModeToggle />
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
