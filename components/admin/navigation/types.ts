import type { LucideIcon } from "lucide-react";

export type AdminNavigationSurface = "sidebar" | "mobile-primary" | "mobile-more";

export type AdminNavigationVisibility = {
  sidebar?: boolean;
  mobilePrimary?: boolean;
  mobileMore?: boolean;
};

export type AdminNavigationItemGroupKey =
  | "main"
  | "shop"
  | "commerce"
  | "marketing"
  | "content"
  | "maintenance"
  | "settings";

export type AdminNavigationItem = {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;

  group: AdminNavigationItemGroupKey;
  order?: number;

  visibility: AdminNavigationVisibility;

  disabled?: boolean;
  badge?: string;
  exact?: boolean;
};

export type AdminNavigationGroupDefinition = {
  key: AdminNavigationItemGroupKey;
  label: string;
  defaultOpen?: boolean;
};

export type AdminNavigationGroup = {
  key: AdminNavigationItemGroupKey;
  label: string;
  defaultOpen?: boolean;
  items: AdminNavigationItem[];
};
