import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import type {
  AdminNewsletterSubscriberFilters,
  AdminNewsletterSubscriberListResult,
} from "@/features/admin/marketing/newsletter/types/admin-newsletter-subscriber.types";

const RECENT_SUBSCRIPTION_WINDOW_DAYS = 30;

function getRecentSubscriptionCutoff(now: Date): Date {
  return new Date(now.getTime() - RECENT_SUBSCRIPTION_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Liste les `NewsletterSubscriber` du store courant (non archivés), pour la
 * page admin `/admin/marketing/newsletter` — niveau `basic`
 * (cf. `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`).
 */
export async function listAdminNewsletterSubscribers(
  filters: AdminNewsletterSubscriberFilters = {}
): Promise<AdminNewsletterSubscriberListResult> {
  const storeId = await getCurrentStoreId();
  const recentSubscriptionCutoff = getRecentSubscriptionCutoff(new Date());

  if (storeId === null) {
    return {
      items: [],
      counts: {
        total: 0,
        subscribed: 0,
        unsubscribed: 0,
        bounced: 0,
        pending: 0,
        adminSource: 0,
        storefrontSource: 0,
        linkedCustomers: 0,
        recentSubscriptions: 0,
      },
    };
  }

  const baseWhere = {
    storeId,
    archivedAt: null,
  } as const;

  const filteredWhere = {
    ...baseWhere,
    ...(filters.status && filters.status !== "all" ? { status: filters.status } : {}),
    ...(filters.source && filters.source !== "all" ? { source: filters.source } : {}),
    ...(filters.customerLink === "linked"
      ? { customerId: { not: null as string | null } }
      : filters.customerLink === "unlinked"
        ? { customerId: null }
        : {}),
    ...(filters.recency === "recent"
      ? { subscribedAt: { gte: recentSubscriptionCutoff } }
      : {}),
  };

  const [items, total, statusCounts, adminSourceCount, storefrontSourceCount, linkedCustomersCount, recentSubscriptionsCount] =
    await Promise.all([
      db.newsletterSubscriber.findMany({
        where: filteredWhere,
        orderBy: [{ subscribedAt: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          status: true,
          source: true,
          customerId: true,
          subscribedAt: true,
          unsubscribedAt: true,
          createdAt: true,
        },
      }),
      db.newsletterSubscriber.count({ where: baseWhere }),
      db.newsletterSubscriber.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: { id: true },
      }),
      db.newsletterSubscriber.count({
        where: {
          ...baseWhere,
          source: "admin",
        },
      }),
      db.newsletterSubscriber.count({
        where: {
          ...baseWhere,
          source: "storefront",
        },
      }),
      db.newsletterSubscriber.count({
        where: {
          ...baseWhere,
          customerId: { not: null },
        },
      }),
      db.newsletterSubscriber.count({
        where: {
          ...baseWhere,
          subscribedAt: { gte: recentSubscriptionCutoff },
        },
      }),
    ]);

  const groupedStatusCounts = Object.fromEntries(
    statusCounts.map((entry) => [entry.status, entry._count.id])
  );

  return {
    items,
    counts: {
      total,
      subscribed: groupedStatusCounts.SUBSCRIBED ?? 0,
      unsubscribed: groupedStatusCounts.UNSUBSCRIBED ?? 0,
      bounced: groupedStatusCounts.BOUNCED ?? 0,
      pending: groupedStatusCounts.PENDING ?? 0,
      adminSource: adminSourceCount,
      storefrontSource: storefrontSourceCount,
      linkedCustomers: linkedCustomersCount,
      recentSubscriptions: recentSubscriptionsCount,
    },
  };
}
