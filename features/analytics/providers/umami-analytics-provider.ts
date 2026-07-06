import "server-only";

import { serverEnv } from "@/core/config/env/server";

import type { AnalyticsProvider, AnalyticsTopPage } from "./analytics-provider.types";

const REQUEST_TIMEOUT_MS = 5000;
const CACHE_REVALIDATE_SECONDS = 300;

type UmamiLoginResponse = Readonly<{ token: string }>;
type UmamiMetric = Readonly<{ x: string; y: number }>;

async function loginToUmami(): Promise<string> {
  const response = await fetch(`${serverEnv.umamiApiHost}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: serverEnv.umamiUsername,
      password: serverEnv.umamiPassword,
    }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Umami login failed with status ${response.status}: ${body}`);
  }

  const data = (await response.json()) as UmamiLoginResponse;
  return data.token;
}

async function queryUmamiVisitorsByPage(
  token: string,
  startAt: number,
  endAt: number
): Promise<Map<string, number>> {
  const url = new URL(`${serverEnv.umamiApiHost}/api/websites/${serverEnv.umamiWebsiteId}/metrics`);
  url.searchParams.set("startAt", String(startAt));
  url.searchParams.set("endAt", String(endAt));
  url.searchParams.set("type", "path");
  url.searchParams.set("limit", "5");

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    next: { revalidate: CACHE_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Umami metrics request failed with status ${response.status}: ${body}`);
  }

  const metrics = (await response.json()) as UmamiMetric[];
  return new Map(metrics.map((metric) => [metric.x, metric.y]));
}

/**
 * Traduit la réponse Umami (self-hosted, REST API, login username/password)
 * vers le vocabulaire interne `AnalyticsTopPage`. Aucun type ou champ Umami
 * ne doit s'échapper de ce fichier.
 */
export class UmamiAnalyticsProvider implements AnalyticsProvider {
  async getTopPages(): Promise<AnalyticsTopPage[] | null> {
    try {
      const token = await loginToUmami();
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;

      const [current, previous] = await Promise.all([
        queryUmamiVisitorsByPage(token, now - 7 * oneDayMs, now),
        queryUmamiVisitorsByPage(token, now - 14 * oneDayMs, now - 7 * oneDayMs),
      ]);

      return Array.from(current.entries())
        .slice(0, 5)
        .map(([path, views]) => {
          const previousViews = previous.get(path) ?? 0;
          const delta = previousViews > 0 ? ((views - previousViews) / previousViews) * 100 : 0;
          return { path, views, delta };
        });
    } catch (error) {
      console.error("[analytics:umami] échec de récupération des pages les plus visitées", error);
      return null;
    }
  }
}
