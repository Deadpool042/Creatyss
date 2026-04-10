import type { AdminNavigationGroupDefinition, AdminNavigationItem } from "../types";
import {
  adminNavigationCapabilities,
  adminNavigationFeatureFlags,
} from "./admin-navigation-policy";

export const adminNavigationGroupDefinitions: ReadonlyArray<AdminNavigationGroupDefinition> = [
  {
    key: "main",
    label: "Général",
    defaultOpen: true,
  },
  {
    key: "catalog",
    label: "Catalogue",
    defaultOpen: true,
  },
  {
    key: "commerce",
    label: "Commerce",
    defaultOpen: true,
  },
  {
    key: "content",
    label: "Contenu",
    defaultOpen: true,
  },
  {
    key: "marketing",
    label: "Marketing",
    defaultOpen: false,
  },
  {
    key: "insights",
    label: "Pilotage",
    defaultOpen: false,
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
    iconKey: "layoutGrid",
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
    iconKey: "package",
    group: "catalog",
    order: 10,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "categories",
    label: "Catégories",
    href: "/admin/categories",
    iconKey: "folderTree",
    group: "catalog",
    order: 20,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "media",
    label: "Médias",
    href: "/admin/media",
    iconKey: "imageIcon",
    group: "catalog",
    order: 30,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },

  {
    key: "commerce-overview",
    label: "Vue d’ensemble",
    href: "/admin/commerce/overview",
    iconKey: "search",
    group: "commerce",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
  },
  {
    key: "orders",
    label: "Commandes",
    href: "/admin/commerce/orders",
    iconKey: "shoppingCart",
    group: "commerce",
    order: 20,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.commerce.ordersRead],
    },
  },
  {
    key: "customers",
    label: "Clients",
    href: "/admin/commerce/customers",
    iconKey: "users",
    group: "commerce",
    order: 30,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.commerce.customersRead],
    },
  },
  {
    key: "payments",
    label: "Paiements",
    href: "/admin/commerce/payments",
    iconKey: "creditCard",
    group: "commerce",
    order: 40,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      featureFlagsAll: [adminNavigationFeatureFlags.commerce.payments],
      capabilitiesAll: [adminNavigationCapabilities.commerce.paymentsRead],
    },
  },
  {
    key: "shipping",
    label: "Livraisons",
    href: "/admin/commerce/shipping",
    iconKey: "truck",
    group: "commerce",
    order: 50,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      featureFlagsAll: [adminNavigationFeatureFlags.commerce.shipping],
      capabilitiesAll: [adminNavigationCapabilities.commerce.shippingRead],
    },
  },

  {
    key: "content-overview",
    label: "Vue d’ensemble",
    href: "/admin/content/overview",
    iconKey: "search",
    group: "content",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
  },
  {
    key: "homepage",
    label: "Page d’accueil",
    href: "/admin/content/homepage",
    iconKey: "house",
    group: "content",
    order: 20,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.content.homepageRead],
    },
  },
  {
    key: "blog",
    label: "Blog",
    href: "/admin/content/blog",
    iconKey: "fileText",
    group: "content",
    order: 30,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.content.blogRead],
    },
  },
  {
    key: "seo",
    label: "SEO",
    href: "/admin/content/seo",
    iconKey: "search",
    group: "content",
    order: 40,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.content.seoRead],
    },
  },

  {
    key: "newsletter",
    label: "Newsletter",
    href: "/admin/marketing/newsletter",
    iconKey: "mail",
    group: "marketing",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      featureFlagsAll: [adminNavigationFeatureFlags.engagement.newsletter],
      capabilitiesAll: [adminNavigationCapabilities.marketing.newsletterRead],
    },
  },
  {
    key: "discounts",
    label: "Réductions",
    href: "/admin/marketing/discounts",
    iconKey: "badgePercent",
    group: "marketing",
    order: 20,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      featureFlagsAll: [adminNavigationFeatureFlags.commerce.discounts],
      capabilitiesAll: [adminNavigationCapabilities.marketing.discountsRead],
    },
  },
  {
    key: "automations",
    label: "Automations",
    href: "/admin/marketing/automations",
    iconKey: "zap",
    group: "marketing",
    order: 30,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.marketing.automationsRead],
    },
  },

  {
    key: "analytics",
    label: "Analyses",
    href: "/admin/insights/analytics",
    iconKey: "barChart3",
    group: "insights",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      featureFlagsAll: [adminNavigationFeatureFlags.engagement.analytics],
      capabilitiesAll: [adminNavigationCapabilities.insights.analyticsRead],
    },
  },

  {
    key: "maintenance-logs",
    label: "Logs",
    href: "/admin/maintenance/logs",
    iconKey: "wrench",
    group: "maintenance",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.system.logsRead],
    },
  },
  {
    key: "maintenance-monitoring",
    label: "Monitoring",
    href: "/admin/maintenance/monitoring",
    iconKey: "heartPulse",
    group: "maintenance",
    order: 20,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.system.monitoringRead],
    },
  },
  {
    key: "maintenance-observability",
    label: "Observabilité",
    href: "/admin/maintenance/observability",
    iconKey: "activity",
    group: "maintenance",
    order: 30,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.system.observabilityRead],
    },
  },

  {
    key: "general-settings",
    label: "Réglages généraux",
    href: "/admin/settings/general",
    iconKey: "settings",
    group: "settings",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
  },
  {
    key: "payment-settings",
    label: "Réglages de paiement",
    href: "/admin/settings/payments",
    iconKey: "creditCard",
    group: "settings",
    order: 20,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      featureFlagsAll: [adminNavigationFeatureFlags.commerce.payments],
      capabilitiesAll: [adminNavigationCapabilities.settings.paymentsRead],
    },
  },
  {
    key: "shipping-settings",
    label: "Réglages de livraison",
    href: "/admin/settings/shipping",
    iconKey: "truck",
    group: "settings",
    order: 30,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      featureFlagsAll: [adminNavigationFeatureFlags.commerce.shipping],
      capabilitiesAll: [adminNavigationCapabilities.settings.shippingRead],
    },
  },
  {
    key: "store-settings",
    label: "Réglages de la boutique",
    href: "/admin/settings/store",
    iconKey: "house",
    group: "settings",
    order: 40,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
  },
  {
    key: "advanced-settings",
    label: "Réglages avancés",
    href: "/admin/settings/advanced",
    iconKey: "settings",
    group: "settings",
    order: 50,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
    },
  },
];
