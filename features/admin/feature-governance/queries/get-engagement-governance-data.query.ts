import "server-only";

import { db } from "@/core/db";

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

export type NewsletterGovernanceData = Readonly<{
  total: number;
  subscribed: number;
  unsubscribed: number;
}>;

export type AutomationsGovernanceData = Readonly<{
  totalDefs: number;
  activeDefs: number;
  failedJobs: number;
}>;

export type AnalyticsGovernanceData = Readonly<{
  totalOrders: number;
  totalCustomers: number;
  recentOrders: number;
}>;

export async function getNewsletterGovernanceData(): Promise<NewsletterGovernanceData | null> {
  try {
    const [total, subscribed, unsubscribed] = await Promise.all([
      db.newsletterSubscriber.count(),
      db.newsletterSubscriber.count({ where: { status: "SUBSCRIBED" } }),
      db.newsletterSubscriber.count({ where: { status: "UNSUBSCRIBED" } }),
    ]);

    return { total, subscribed, unsubscribed };
  } catch {
    return null;
  }
}

export async function getAutomationsGovernanceData(): Promise<AutomationsGovernanceData | null> {
  try {
    const [totalDefs, activeDefs, failedJobs] = await Promise.all([
      db.automation.count(),
      db.automation.count({ where: { status: "ACTIVE" } }),
      db.job.count({ where: { status: "FAILED" } }),
    ]);

    return { totalDefs, activeDefs, failedJobs };
  } catch {
    return null;
  }
}

export async function getAnalyticsGovernanceData(): Promise<AnalyticsGovernanceData | null> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - THIRTY_DAYS_IN_MS);

    const [totalOrders, totalCustomers, recentOrders] = await Promise.all([
      db.order.count(),
      db.customer.count(),
      db.order.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
          status: "CONFIRMED",
        },
      }),
    ]);

    return { totalOrders, totalCustomers, recentOrders };
  } catch {
    return null;
  }
}
