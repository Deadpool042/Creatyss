export const adminNavigationCapabilities = {
  commerce: {
    ordersRead: "admin.commerce.orders.read",
    customersRead: "admin.commerce.customers.read",
    paymentsRead: "admin.commerce.payments.read",
    shippingRead: "admin.commerce.shipping.read",
  },
  content: {
    homepageRead: "admin.content.homepage.read",
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
  settings: {
    paymentsRead: "admin.settings.payments.read",
    shippingRead: "admin.settings.shipping.read",
    advancedRead: "admin.settings.advanced.read",
  },
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
  },
  engagement: {
    newsletter: "engagement.newsletter",
    analytics: "engagement.analytics",
  },
} as const;
