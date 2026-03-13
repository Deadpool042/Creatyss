"use client";

import {
  FileText,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Tag
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { AdminSidebarLink } from "./admin-sidebar-link";

type AdminSidebarProps = {
  displayName: string;
  email: string;
};

const NAV_GROUPS: ReadonlyArray<{
  label: string;
  links: ReadonlyArray<{ href: string; label: string; icon: LucideIcon }>;
}> = [
  {
    label: "Catalogue",
    links: [
      { href: "/admin/products", label: "Produits", icon: Package },
      { href: "/admin/categories", label: "Catégories", icon: Tag }
    ]
  },
  {
    label: "Contenu",
    links: [
      { href: "/admin/homepage", label: "Page d'accueil", icon: Globe },
      { href: "/admin/blog", label: "Blog", icon: FileText }
    ]
  },
  {
    label: "Opérations",
    links: [
      { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
      { href: "/admin/media", label: "Médias", icon: ImageIcon }
    ]
  }
];

export function AdminSidebar({ displayName, email }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-4 border-b border-sidebar-border px-4 py-4 group-data-[collapsible=icon]:hidden">
        <a
          href="/admin"
          className="rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            Administration
          </p>
          <p className="text-base font-semibold text-sidebar-foreground">
            Creatyss
          </p>
        </a>

        <div className="rounded-lg border border-sidebar-border/80 bg-background/80 px-3 py-2">
          <p className="truncate text-sm font-medium text-sidebar-foreground">
            {displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">{email}</p>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <nav
          aria-label="Navigation admin"
          className="flex flex-col gap-1">
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu>
                <AdminSidebarLink
                  href="/admin"
                  icon={LayoutDashboard}
                  tooltip="Accueil admin">
                  Accueil admin
                </AdminSidebarLink>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-2 my-2" />

          {NAV_GROUPS.map((group) => (
            <SidebarGroup
              key={group.label}
              className="p-0">
              <SidebarGroupLabel className="px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
                {group.label}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {group.links.map((link) => (
                    <AdminSidebarLink
                      key={link.href}
                      href={link.href}
                      icon={link.icon}
                      tooltip={link.label}>
                      {link.label}
                    </AdminSidebarLink>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <form
              action="/admin/logout"
              method="post">
              <SidebarMenuButton
                type="submit"
                tooltip="Se déconnecter">
                <LogOut />
                <span className="group-data-[collapsible=icon]:hidden">
                  Se déconnecter
                </span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
