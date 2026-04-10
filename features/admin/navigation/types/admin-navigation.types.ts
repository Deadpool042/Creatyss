export type AdminNavigationGroupKey =
  | "main"
  | "catalog"
  | "commerce"
  | "content"
  | "marketing"
  | "insights"
  | "maintenance"
  | "settings";

export type AdminNavigationIconKey =
  | "activity"
  | "badgePercent"
  | "barChart3"
  | "creditCard"
  | "fileText"
  | "folderTree"
  | "heartPulse"
  | "house"
  | "imageIcon"
  | "layoutGrid"
  | "mail"
  | "megaphone"
  | "package"
  | "search"
  | "settings"
  | "shoppingCart"
  | "truck"
  | "users"
  | "wrench"
  | "zap";

export type AdminNavigationVisibility = {
  sidebar: boolean;
  mobilePrimary?: boolean;
  mobileMore?: boolean;
};

export type AdminNavigationAccessRule = {
  capabilitiesAll?: readonly string[];
  capabilitiesAny?: readonly string[];
  featureFlagsAll?: readonly string[];
  featureFlagsAny?: readonly string[];
  internalOnly?: boolean;
};

export type AdminNavigationBadge = {
  kind: "info" | "warning";
  label: string;
};

export type AdminNavigationItem = {
  key: string;
  label: string;
  href: string;
  iconKey: AdminNavigationIconKey;
  group: AdminNavigationGroupKey;
  order: number;
  exact?: boolean;
  visibility: AdminNavigationVisibility;
  access?: AdminNavigationAccessRule;
  badge?: AdminNavigationBadge;
};

export type AdminNavigationGroupDefinition = {
  key: AdminNavigationGroupKey;
  label: string;
  defaultOpen?: boolean;
};

export type AdminNavigationGroup = {
  key: AdminNavigationGroupKey;
  label: string;
  defaultOpen?: boolean;
  items: ReadonlyArray<AdminNavigationItem>;
};

export type AdminNavigationContext = {
  capabilities: ReadonlySet<string>;
  featureFlags: ReadonlySet<string>;
  isInternalUser: boolean;
};
