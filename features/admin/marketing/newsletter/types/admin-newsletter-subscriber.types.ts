import type { NewsletterSubscriberStatus } from "@/prisma-generated/client";

/**
 * Résumé d'un `NewsletterSubscriber` pour la liste admin (niveau `basic`,
 * cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`).
 *
 * Niveau `basic` : CRUD référentiel des abonnés uniquement. Aucune
 * `NewsletterCampaign` n'est créée ou envoyée par ce lot.
 */
export type AdminNewsletterSubscriberSummary = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  status: NewsletterSubscriberStatus;
  source: string | null;
  customerId: string | null;
  subscribedAt: Date | null;
  unsubscribedAt: Date | null;
  createdAt: Date;
};

export type AdminNewsletterSubscriberStatusFilter =
  | "all"
  | "SUBSCRIBED"
  | "UNSUBSCRIBED"
  | "BOUNCED"
  | "PENDING";

export type AdminNewsletterSubscriberSourceFilter = "all" | "admin" | "storefront";

export type AdminNewsletterSubscriberCustomerLinkFilter = "all" | "linked" | "unlinked";

export type AdminNewsletterSubscriberRecencyFilter = "all" | "recent";

export type AdminNewsletterSubscriberFilters = {
  status?: AdminNewsletterSubscriberStatusFilter | undefined;
  source?: AdminNewsletterSubscriberSourceFilter | undefined;
  customerLink?: AdminNewsletterSubscriberCustomerLinkFilter | undefined;
  recency?: AdminNewsletterSubscriberRecencyFilter | undefined;
};

export type AdminNewsletterSubscriberSummaryCounts = {
  total: number;
  subscribed: number;
  unsubscribed: number;
  bounced: number;
  pending: number;
  adminSource: number;
  storefrontSource: number;
  linkedCustomers: number;
  recentSubscriptions: number;
};

export type AdminNewsletterSubscriberListResult = {
  items: AdminNewsletterSubscriberSummary[];
  counts: AdminNewsletterSubscriberSummaryCounts;
};
