import type { LucideIcon } from "lucide-react";

export type AdminSidebarNavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  disabled?: boolean;
  badge?: string;
  exact?: boolean;
};

export type AdminSidebarNavGroup = {
  key: string;
  title: string;
  icon: LucideIcon;
  defaultOpen?: boolean;
  items: ReadonlyArray<AdminSidebarNavItem>;
};
