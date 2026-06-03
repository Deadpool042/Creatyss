export const ORDER_NAVIGATION_CONFIG = {
  home: {
    label: "Accueil",
    href: "/admin",
  },
  commerceOverview: {
    label: "Vue d'ensemble",
    href: "/admin/commerce/overview",
  },
  orders: {
    label: "Commandes",
    href: "/admin/commerce/orders",
  },
} as const;

export const ORDER_LIST_PAGE_CONFIG = {
  eyebrow: "Commandes",
  title: "Gestion des commandes",
  description:
    "Visualisez et gérez les commandes passées par les clients, suivez leur statut et assurez un service client de qualité.",
} as const;
