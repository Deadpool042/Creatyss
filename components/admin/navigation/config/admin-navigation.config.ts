import {
  BadgePercent,
  CreditCard,
  FileText,
  FolderTree,
  House,
  ImageIcon,
  LayoutGrid,
  Mail,
  Megaphone,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import type {
  AdminNavigationGroup,
  AdminNavigationGroupDefinition,
  AdminNavigationItem,
} from "../types";

export const adminNavigationGroupDefinitions: ReadonlyArray<AdminNavigationGroupDefinition> = [
  {
    key: "main",
    label: "Général",
    defaultOpen: true,
  },
  {
    key: "shop",
    label: "Boutique",
    defaultOpen: true,
  },
  {
    key: "commerce",
    label: "Commerce",
    defaultOpen: true,
  },
  {
    key: "marketing",
    label: "Marketing",
    defaultOpen: false,
  },
  {
    key: "content",
    label: "Contenu",
    defaultOpen: true,
  },
  {
    key: "maintenance",
    label: "Maintenance",
    defaultOpen: false,
  },
  {
    key: "settings",
    label: "Réglages",
    defaultOpen: false,
  },
];

export const adminNavigationItems: ReadonlyArray<AdminNavigationItem> = [
  {
    key: "dashboard",
    label: "Accueil",
    href: "/admin",
    icon: LayoutGrid,
    group: "main",
    order: 10,
    exact: true,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "products",
    label: "Produits",
    href: "/admin/products",
    icon: Package,
    group: "shop",
    order: 20,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "categories",
    label: "Catégories",
    href: "/admin/categories",
    icon: FolderTree,
    group: "shop",
    order: 30,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "media",
    label: "Médias",
    href: "/admin/media",
    icon: ImageIcon,
    group: "main",
    order: 40,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "commerce",
    label: "Commerce",
    href: "/admin/commerce",
    icon: ShoppingCart,
    group: "commerce",
    order: 0,
    visibility: {
      sidebar: false,
      mobileMore: true,
    },
  },
  {
    key: "orders",
    label: "Commandes",
    href: "/admin/commerce/orders",
    icon: ShoppingCart,
    group: "commerce",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "payments",
    label: "Paiements",
    href: "/admin/commerce/payments",
    icon: CreditCard,
    group: "commerce",
    order: 20,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "customers",
    label: "Clients",
    href: "/admin/commerce/customers",
    icon: Users,
    group: "commerce",
    order: 30,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "shipping",
    label: "Livraisons",
    href: "/admin/commerce/shipping",
    icon: Truck,
    group: "commerce",
    order: 40,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "marketing",
    label: "Marketing",
    href: "/admin/marketing",
    icon: Megaphone,
    group: "marketing",
    order: 0,
    visibility: {
      sidebar: false,
      mobilePrimary: false,
      mobileMore: true,
    },
  },
  {
    key: "newsletter",
    label: "Newsletter",
    href: "/admin/marketing/newsletter",
    icon: Mail,
    group: "marketing",
    order: 10,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "promotions",
    label: "Promotions",
    href: "/admin/marketing/promotions",
    icon: Megaphone,
    group: "marketing",
    order: 20,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "coupons",
    label: "Codes promo",
    href: "/admin/marketing/coupons",
    icon: BadgePercent,
    group: "marketing",
    order: 30,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "seo",
    label: "SEO",
    href: "/admin/marketing/seo",
    icon: Search,
    group: "marketing",
    order: 40,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "automations",
    label: "Automations",
    href: "/admin/marketing/automations",
    icon: Zap,
    group: "marketing",
    order: 50,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "content",
    label: "Contenu",
    href: "/admin/content",
    icon: FileText,
    group: "content",
    order: 0,
    visibility: {
      sidebar: false,
      mobilePrimary: false,
      mobileMore: true,
    },
  },
  {
    key: "homepage",
    label: "Page d’accueil",
    href: "/admin/content/homepage",
    icon: House,
    group: "content",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "blog",
    label: "Blog",
    href: "/admin/content/blog",
    icon: FileText,
    group: "content",
    order: 20,
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "maintenance",
    label: "Maintenance",
    href: "/admin/maintenance",
    icon: Wrench,
    group: "maintenance",
    order: 10,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
  {
    key: "settings",
    label: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
    group: "settings",
    order: 10,
    disabled: true,
    badge: "Bientôt",
    visibility: {
      sidebar: true,
      mobileMore: false,
    },
  },
];

function sortNavigationItems(left: AdminNavigationItem, right: AdminNavigationItem): number {
  return (left.order ?? 0) - (right.order ?? 0);
}

export const adminNavigationGroups: ReadonlyArray<AdminNavigationGroup> =
  adminNavigationGroupDefinitions
    .map((groupDefinition) => {
      const items = adminNavigationItems
        .filter((item) => item.group === groupDefinition.key)
        .sort(sortNavigationItems);

      return {
        key: groupDefinition.key,
        label: groupDefinition.label,
        ...(groupDefinition.defaultOpen !== undefined
          ? { defaultOpen: groupDefinition.defaultOpen }
          : {}),
        items,
      };
    })
    .filter((group) => group.items.length > 0);

export const adminMobilePrimaryNavigationItems = adminNavigationItems
  .filter((item) => item.visibility.mobilePrimary)
  .sort(sortNavigationItems);

export const adminMobileMoreNavigationItems = adminNavigationItems
  .filter((item) => item.visibility.mobileMore)
  .sort(sortNavigationItems);
