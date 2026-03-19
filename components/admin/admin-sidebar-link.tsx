"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type AdminSidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  tooltip: string;
  children: React.ReactNode;
};

export function AdminSidebarLink({ href, icon: Icon, tooltip, children }: AdminSidebarLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={tooltip}
        isActive={isActive}
        className={cn(
          "h-9 rounded-lg transition-colors duration-150",
          isActive
            ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
            : "text-sidebar-foreground/75 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
      >
        <Link href={href}>
          <Icon className={cn("size-4 shrink-0", isActive && "text-brand")} />
          {children}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
