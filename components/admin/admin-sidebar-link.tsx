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

export function AdminSidebarLink({
  href,
  icon: Icon,
  tooltip,
  children
}: AdminSidebarLinkProps) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (href !== "/admin" && pathname.startsWith(`${href}/`));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={tooltip}
        isActive={isActive}
        className={cn(
          "h-10 rounded-xl border border-transparent transition-all duration-200",
          "hover:border-sidebar-border/70 hover:bg-sidebar-accent/50",
          isActive &&
            "border-sidebar-border/80 bg-sidebar-accent text-sidebar-foreground shadow-sm"
        )}>
        <Link href={href}>
          <Icon className="size-4" />
          {children}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
