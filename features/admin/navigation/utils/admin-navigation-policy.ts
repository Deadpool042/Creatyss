export const adminNavigationCapabilities = {
  commerce: {
    ordersRead: "admin.commerce.orders.read",
    customersRead: "admin.commerce.customers.read",
    paymentsRead: "admin.commerce.payments.read",
    paymentsCapture: "admin.commerce.payments.capture",
    paymentsCancel: "admin.commerce.payments.cancel",
    shippingRead: "admin.commerce.shipping.read",
  },
  content: {
    homepageRead: "admin.content.homepage.read",
    pagesRead: "admin.content.pages.read",
    pagesWrite: "admin.content.pages.write",
    blogRead: "admin.content.blog.read",
    seoRead: "admin.content.seo.read",
  },
  marketing: {
    newsletterRead: "admin.marketing.newsletter.read",
    discountsRead: "admin.marketing.discounts.read",
    automationsRead: "admin.marketing.automations.read",
  },
  insights: {
    analyticsRead: "admin.insights.analytics.read",
  },
  catalog: {
    pricingRead: "admin.catalog.pricing.read",
  },
  settings: {
    generalRead: "admin.settings.general.read",
    generalWrite: "admin.settings.general.write",
    storeRead: "admin.settings.store.read",
    storeWrite: "admin.settings.store.write",
    teamRead: "admin.settings.team.read",
    teamWrite: "admin.settings.team.write",
    teamSuspend: "admin.settings.team.suspend",
    paymentsRead: "admin.settings.payments.read",
    paymentsWrite: "admin.settings.payments.write",
    shippingRead: "admin.settings.shipping.read",
    shippingWrite: "admin.settings.shipping.write",
    ordersRead: "admin.settings.orders.read",
    ordersWrite: "admin.settings.orders.write",
    catalogRead: "admin.settings.catalog.read",
    mediaRead: "admin.settings.media.read",
    seoRead: "admin.settings.seo.read",
    seoWrite: "admin.settings.seo.write",
    advancedRead: "admin.settings.advanced.read",
    apiClientsRead: "admin.settings.api-clients.read",
    apiClientsWrite: "admin.settings.api-clients.write",
    apiClientsRevoke: "admin.settings.api-clients.revoke",
    // Réservé : aucune route ni action ne consomme cette capability à ce jour.
    webhooksRead: "admin.settings.webhooks.read",
    notificationsRead: "admin.settings.notifications.read",
    notificationsWrite: "admin.settings.notifications.write",
  },
  // Réservé : capabilities system déclarées et seedées, aucune route ne les
  // consomme à ce jour (logs, monitoring, observabilité à venir).
  system: {
    logsRead: "admin.system.logs.read",
    monitoringRead: "admin.system.monitoring.read",
    observabilityRead: "admin.system.observability.read",
  },
} as const;

export const adminNavigationFeatureFlags = {
  commerce: {
    payments: "commerce.payments",
    shipping: "commerce.shipping",
    discounts: "commerce.discounts",
    fulfillment: "commerce.fulfillment",
    returns: "commerce.returns",
    documents: "commerce.documents",
    taxation: "commerce.taxation",
  },
  engagement: {
    newsletter: "engagement.newsletter",
    analytics: "engagement.analytics",
    automations: "engagement.automations",
  },
  platform: {
    notifications: "platform.notifications",
    integrations: "platform.integrations",
    webhooks: "platform.webhooks",
    localization: "platform.localization",
  },
  satellite: {
    search: "satellite.search",
    channels: "satellite.channels",
  },
} as const;
