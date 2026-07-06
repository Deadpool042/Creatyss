import type { AdminNavigationGroupDefinition, AdminNavigationItem } from "../types";
import {
  adminNavigationCapabilities,
  adminNavigationFeatureFlags,
} from "./admin-navigation-policy";

export const adminNavigationGroupDefinitions: ReadonlyArray<AdminNavigationGroupDefinition> = [
  {
    key: "main",
    label: "Tableau de bord",
    defaultOpen: false,
  },
  {
    key: "catalog",
    label: "Catalogue",
    defaultOpen: false,
  },
  {
    key: "commerce",
    label: "Commerce",
    defaultOpen: false,
  },
  {
    key: "content",
    label: "Contenu",
    defaultOpen: false,
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
    key: "dashboard-catalog",
    label: "Vue d’ensemble — Catalogue",
    href: "/admin/catalog/overview",
    iconKey: "search",
    group: "catalog",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
  },

  {
    key: "products",
    label: "Produits",
    href: "/admin/catalog/products",
    iconKey: "package",
    group: "catalog",
    order: 20,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "categories",
    label: "Catégories",
    href: "/admin/catalog/categories/overview",
    iconKey: "folderTree",
    group: "catalog",
    order: 30,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "media",
    label: "Médias",
    href: "/admin/catalog/media",
    iconKey: "imageIcon",
    group: "catalog",
    order: 40,
    visibility: {
      sidebar: true,
      mobilePrimary: true,
    },
  },
  {
    key: "pricing",
    label: "Tarification",
    href: "/admin/catalog/pricing",
    iconKey: "badgePercent",
    group: "catalog",
    order: 50,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.catalog.pricingRead],
    },
  },
  {
    key: "catalog-configuration",
    label: "Configuration",
    href: "/admin/catalog/settings",
    iconKey: "settings",
    group: "catalog",
    order: 60,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.settings.catalogRead],
    },
  },

  {
    key: "commerce-overview",
    label: "Vue d’ensemble — Commerce",
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
    href: "/admin/commerce/orders/overview",
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
    label: "Vue d’ensemble — Contenu",
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
    key: "pages",
    label: "Pages",
    href: "/admin/content/pages",
    iconKey: "link",
    group: "content",
    order: 25,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.content.pagesRead],
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
    key: "marketing-overview",
    label: "Vue d'ensemble — Marketing",
    href: "/admin/marketing/overview",
    iconKey: "megaphone",
    group: "marketing",
    order: 5,
    visibility: {
      sidebar: true,
      mobileMore: true,
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
      featureFlagsAll: [adminNavigationFeatureFlags.engagement.automations],
      capabilitiesAll: [adminNavigationCapabilities.marketing.automationsRead],
    },
  },

  {
    key: "insights-overview",
    label: "Vue d’ensemble — Pilotage",
    href: "/admin/insights/overview",
    iconKey: "search",
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
    key: "analytics",
    label: "Analyses",
    href: "/admin/insights/analytics",
    iconKey: "barChart3",
    group: "insights",
    order: 20,
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
    key: "maintenance-overview",
    label: "Vue d’ensemble — Maintenance",
    href: "/admin/maintenance/overview",
    iconKey: "search",
    group: "maintenance",
    order: 10,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAny: [
        adminNavigationCapabilities.system.logsRead,
        adminNavigationCapabilities.system.monitoringRead,
        adminNavigationCapabilities.system.observabilityRead,
      ],
    },
  },
  {
    key: "maintenance-logs",
    label: "Logs",
    href: "/admin/maintenance/logs",
    iconKey: "wrench",
    group: "maintenance",
    order: 20,
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
    order: 30,
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
    order: 40,
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
    key: "settings-overview",
    label: "Vue d'ensemble — Réglages",
    href: "/admin/settings",
    iconKey: "settings",
    group: "settings",
    order: 10,
    exact: true,
    visibility: {
      sidebar: true,
      mobileMore: true,
    },
  },
  {
    key: "general-settings",
    label: "Général",
    href: "/admin/settings/general",
    iconKey: "settings",
    group: "settings",
    order: 15,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.settings.generalRead],
    },
  },
  {
    key: "store-settings",
    label: "Boutique",
    href: "/admin/settings/store",
    iconKey: "house",
    group: "settings",
    order: 20,
    visibility: {
      sidebar: true,
      mobileMore: true,
      settingsHub: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.settings.storeRead],
    },
  },
  {
    key: "notifications-settings",
    label: "Notifications",
    href: "/admin/settings/notifications",
    iconKey: "mail",
    group: "settings",
    order: 37,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.settings.notificationsRead],
    },
  },
  {
    key: "seo-settings",
    label: "SEO",
    href: "/admin/settings/seo",
    iconKey: "search",
    group: "settings",
    order: 38,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.settings.seoRead],
    },
  },
  {
    key: "team-settings",
    label: "Équipe",
    href: "/admin/settings/team",
    iconKey: "users",
    group: "settings",
    order: 39,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.settings.teamRead],
    },
  },
  {
    key: "advanced-settings",
    label: "Modules & fonctionnalités",
    href: "/admin/settings/advanced/overview",
    iconKey: "sliders",
    group: "settings",
    order: 40,
    visibility: {
      sidebar: true,
      mobileMore: true,
      settingsHub: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
    },
  },
  {
    key: "api-clients-settings",
    label: "API clients",
    href: "/admin/settings/api-clients",
    iconKey: "key",
    group: "settings",
    order: 41,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      capabilitiesAll: [adminNavigationCapabilities.settings.apiClientsRead],
    },
  },
  {
    key: "integrations-settings",
    label: "Intégrations",
    href: "/admin/settings/integrations",
    iconKey: "link",
    group: "settings",
    order: 42,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
      featureFlagsAll: [adminNavigationFeatureFlags.platform.integrations],
    },
  },
  {
    key: "webhooks-settings",
    label: "Webhooks",
    href: "/admin/settings/webhooks",
    iconKey: "link",
    group: "settings",
    order: 43,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
      featureFlagsAll: [adminNavigationFeatureFlags.platform.webhooks],
    },
  },
  {
    key: "search-settings",
    label: "Recherche",
    href: "/admin/settings/search",
    iconKey: "search",
    group: "settings",
    order: 44,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
      featureFlagsAll: [adminNavigationFeatureFlags.satellite.search],
    },
  },
  {
    key: "channels-settings",
    label: "Canaux",
    href: "/admin/settings/channels",
    iconKey: "megaphone",
    group: "settings",
    order: 45,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
      featureFlagsAll: [adminNavigationFeatureFlags.satellite.channels],
    },
  },
  {
    key: "localization-settings",
    label: "Localisation",
    href: "/admin/settings/localization",
    iconKey: "globe",
    group: "settings",
    order: 46,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
      featureFlagsAll: [adminNavigationFeatureFlags.platform.localization],
    },
  },
  {
    key: "ai-settings",
    label: "Assistance IA",
    href: "/admin/settings/ai",
    iconKey: "zap",
    group: "settings",
    order: 47,
    visibility: {
      sidebar: false,
      settingsHub: true,
    },
    access: {
      internalOnly: true,
      capabilitiesAll: [adminNavigationCapabilities.settings.advancedRead],
      featureFlagsAll: [adminNavigationFeatureFlags.ai.core],
    },
  },
];
