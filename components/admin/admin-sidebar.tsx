"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator
} from "@/components/ui/sidebar";
import { AdminSidebarLink } from "./admin-sidebar-link";

type AdminSidebarProps = { displayName: string; email: string };

const NAV_GROUPS = [
  {
    label: "Catalogue",
    links: [
      { href: "/admin/products", label: "Produits" },
      { href: "/admin/categories", label: "Catégories" }
    ]
  },
  {
    label: "Contenu",
    links: [
      { href: "/admin/homepage", label: "Page d'accueil" },
      { href: "/admin/blog", label: "Blog" }
    ]
  },
  {
    label: "Opérations",
    links: [
      { href: "/admin/orders", label: "Commandes" },
      { href: "/admin/media", label: "Médias" }
    ]
  }
] as const;

export function AdminSidebar({ displayName, email }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="gap-4 border-b border-sidebar-border px-4 py-4">
        <Link
          href="/admin"
          className="rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f5d2d]">
            Administration
          </p>
          <p className="text-base font-semibold text-sidebar-foreground">
            Creatyss
          </p>
        </Link>

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
                <AdminSidebarLink href="/admin">Accueil admin</AdminSidebarLink>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="mx-2 my-2" />

          {NAV_GROUPS.map((group) => (
            <SidebarGroup
              key={group.label}
              className="p-0">
              <SidebarGroupLabel className="px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8f5d2d]">
                {group.label}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  {group.links.map((link) => (
                    <AdminSidebarLink
                      key={link.href}
                      href={link.href}>
                      {link.label}
                    </AdminSidebarLink>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-4 py-4">
        <form
          action="/admin/logout"
          method="post"
          className="w-full">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start rounded-lg px-2.5">
            Se déconnecter
          </Button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
