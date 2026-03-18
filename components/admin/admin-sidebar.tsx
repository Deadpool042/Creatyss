"use client";

import {
  BadgePercent,
  CreditCard,
  FileText,
  Globe,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Megaphone,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingBagIcon,
  ShoppingCart,
  Tag,
  Truck,
  Users,
  Wrench,
  Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar";

import { AdminSidebarGroup } from "./admin-sidebar-group";
import { AdminSidebarLink } from "./admin-sidebar-link";

type AdminSidebarProps = {
  displayName: string;
  email: string;
};

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
};

export type AdminNavGroup = {
  id: string;
  label: string;
  defaultOpen?: boolean;
  items: ReadonlyArray<AdminNavItem>;
  icon: LucideIcon;
};

const SHOP_GROUP: AdminNavGroup = {
  id: "shop",
  label: "Boutique",
  icon: ShoppingBagIcon,
  defaultOpen: true,
  items: [
    { href: "/admin/products", label: "Produits", icon: Package },
    { href: "/admin/categories", label: "Catégories", icon: Tag }
  ]
};

const COMMERCE_GROUP: AdminNavGroup = {
  id: "commerce",
  label: "Commerce",
  icon: ShoppingCart,
  defaultOpen: true,
  items: [
    { href: "/admin/orders", label: "Commandes", icon: ShoppingBag },
    {
      href: "/admin/payments",
      label: "Paiements",
      icon: CreditCard,
      disabled: true,
      badge: "Bientôt"
    },
    {
      href: "/admin/customers",
      label: "Clients",
      icon: Users,
      disabled: true,
      badge: "Bientôt"
    },
    {
      href: "/admin/shipping",
      label: "Livraisons",
      icon: Truck,
      disabled: true,
      badge: "Bientôt"
    }
  ]
};

const MARKETING_GROUP: AdminNavGroup = {
  id: "marketing",
  label: "Marketing",
  icon: Megaphone,
  defaultOpen: false,
  items: [
    {
      href: "/admin/newsletter",
      label: "Newsletter",
      icon: Mail,
      disabled: true,
      badge: "Bientôt"
    },
    {
      href: "/admin/promotions",
      label: "Promotions",
      icon: Megaphone,
      disabled: true,
      badge: "Bientôt"
    },
    {
      href: "/admin/coupons",
      label: "Codes promo",
      icon: BadgePercent,
      disabled: true,
      badge: "Bientôt"
    },
    {
      href: "/admin/seo",
      label: "SEO",
      icon: Search,
      disabled: true,
      badge: "Bientôt"
    },
    {
      href: "/admin/automations",
      label: "Automations",
      icon: Zap,
      disabled: true,
      badge: "Bientôt"
    }
  ]
};

const CONTENT_GROUP: AdminNavGroup = {
  id: "content",
  label: "Contenu",
  icon: FileText,
  defaultOpen: true,
  items: [
    { href: "/admin/homepage", label: "Page d'accueil", icon: Globe },
    { href: "/admin/blog", label: "Blog", icon: FileText }
  ]
};

const MAINTENANCE_GROUP: AdminNavGroup = {
  id: "maintenance",
  label: "Maintenance",
  defaultOpen: false,
  icon: Wrench,
  items: [
    {
      href: "/admin/maintenance",
      label: "Maintenance",
      icon: Wrench,
      disabled: true,
      badge: "Bientôt"
    }
  ]
};

const SETTINGS_GROUP: AdminNavGroup = {
  id: "settings",
  label: "Réglages",
  defaultOpen: false,
  icon: Settings,
  items: [
    {
      href: "/admin/settings",
      label: "Paramètres",
      icon: Settings,
      disabled: true,
      badge: "Bientôt"
    }
  ]
};

export function AdminSidebar({ displayName, email }: AdminSidebarProps) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/70 bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border/70 p-2 group-data-[collapsible=icon]:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="rounded-xl hover:bg-sidebar-accent/40">
              <a
                href="/admin"
                aria-label="Administration Creatyss">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                  <LayoutDashboard className="size-4 text-brand" />
                </div>
                <div className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold text-sidebar-foreground">
                    Creatyss
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand">
                    Administration
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <nav
          aria-label="Navigation admin"
          className="flex flex-col gap-0">
          {/* Items racine — portée globale */}
          <SidebarMenu className="gap-0.5 py-1">
            <AdminSidebarLink
              href="/admin"
              icon={LayoutDashboard}
              tooltip="Tableau de bord">
              Tableau de bord
            </AdminSidebarLink>
          </SidebarMenu>

          <SidebarSeparator className="mx-2 my-1 opacity-40" />

          <SidebarMenu className="gap-0.5 py-1">
            <AdminSidebarLink
              href="/admin/media"
              icon={ImageIcon}
              tooltip="Médiathèque">
              Médias
            </AdminSidebarLink>
          </SidebarMenu>

          {/* Groupes métier */}
          <AdminSidebarGroup group={SHOP_GROUP} />
          <AdminSidebarGroup group={COMMERCE_GROUP} />
          <AdminSidebarGroup group={MARKETING_GROUP} />
          <AdminSidebarGroup group={CONTENT_GROUP} />

          <SidebarSeparator className="mx-2 my-1 opacity-40" />

          {/* Systèmes */}
          <AdminSidebarGroup group={MAINTENANCE_GROUP} />
          <AdminSidebarGroup group={SETTINGS_GROUP} />
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/70 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="rounded-xl hover:bg-sidebar-accent/40">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-accent/60 text-sm font-semibold text-sidebar-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {displayName}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {email}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <form
              action="/admin/logout"
              method="post">
              <SidebarMenuButton
                type="submit"
                tooltip="Se déconnecter"
                className="h-9 rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground">
                <LogOut className="size-4" />
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
