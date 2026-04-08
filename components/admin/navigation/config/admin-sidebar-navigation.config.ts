import { LayoutGrid } from "lucide-react";

import { adminNavigationGroups, adminNavigationItems } from "./admin-navigation.config";
import type {
  AdminSidebarNavGroup,
  AdminSidebarNavItem,
} from "@/components/admin/navigation/sidebar";

function mapItemToSidebarNavItem(item: {
  label: string;
  href: string;
  icon: AdminSidebarNavItem["icon"];
  disabled?: boolean;
  badge?: string;
  exact?: boolean;
}): AdminSidebarNavItem {
  return {
    title: item.label,
    url: item.href,
    icon: item.icon,
    ...(item.disabled !== undefined ? { disabled: item.disabled } : {}),
    ...(item.badge !== undefined ? { badge: item.badge } : {}),
    ...(item.exact !== undefined ? { exact: item.exact } : {}),
  };
}

export const adminSidebarRootItems: ReadonlyArray<AdminSidebarNavItem> = adminNavigationItems
  .filter((item) => item.group === "main" && item.visibility.sidebar)
  .map(mapItemToSidebarNavItem);

export const adminSidebarDesktopGroups: ReadonlyArray<AdminSidebarNavGroup> = adminNavigationGroups
  .filter((group) => group.key !== "main")
  .map((group) => {
    const items = group.items
      .filter((item) => item.visibility.sidebar)
      .map(mapItemToSidebarNavItem);

    return {
      key: group.key,
      title: group.label,
      icon: group.items[0]?.icon ?? LayoutGrid,
      ...(group.defaultOpen !== undefined ? { defaultOpen: group.defaultOpen } : {}),
      items,
    };
  })
  .filter((group) => group.items.length > 0);
