import "server-only";

import { db } from "@/core/db";

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

export type NotificationsGovernanceData = Readonly<{
  total: number;
  recent: number;
}>;

export type IntegrationsGovernanceData = Readonly<{
  total: number;
  syncStates: number;
}>;

export type WebhooksGovernanceData = Readonly<{
  totalEndpoints: number;
  totalDeliveries: number;
  failedDeliveries: number;
}>;

export type LocalizationGovernanceData = Readonly<{
  total: number;
  active: number;
  defaultLocale: Readonly<{
    code: string;
    languageCode: string;
  }> | null;
}>;

export async function getNotificationsGovernanceData(): Promise<NotificationsGovernanceData | null> {
  try {
    const sevenDaysAgo = new Date(Date.now() - SEVEN_DAYS_IN_MS);

    const [total, recent] = await Promise.all([
      db.notification.count(),
      db.notification.count({
        where: { createdAt: { gte: sevenDaysAgo } },
      }),
    ]);

    return { total, recent };
  } catch {
    return null;
  }
}

export async function getIntegrationsGovernanceData(): Promise<IntegrationsGovernanceData | null> {
  try {
    const [total, syncStates] = await Promise.all([
      db.integration.count(),
      db.integrationSyncState.count(),
    ]);

    return { total, syncStates };
  } catch {
    return null;
  }
}

export async function getWebhooksGovernanceData(): Promise<WebhooksGovernanceData | null> {
  try {
    const [totalEndpoints, totalDeliveries, failedDeliveries] = await Promise.all([
      db.webhookEndpoint.count(),
      db.webhookDelivery.count(),
      db.webhookDelivery.count({ where: { status: "FAILED" } }),
    ]);

    return {
      totalEndpoints,
      totalDeliveries,
      failedDeliveries,
    };
  } catch {
    return null;
  }
}

export async function getLocalizationGovernanceData(): Promise<LocalizationGovernanceData | null> {
  try {
    const [total, active, defaultLocale] = await Promise.all([
      db.localizationLocale.count(),
      db.localizationLocale.count({ where: { status: "ACTIVE" } }),
      db.localizationLocale.findFirst({
        where: { isDefault: true },
        select: {
          code: true,
          languageCode: true,
        },
      }),
    ]);

    return {
      total,
      active,
      defaultLocale,
    };
  } catch {
    return null;
  }
}
