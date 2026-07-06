//core/analytics/umami/umami-client.ts
import "server-only";

import { serverEnv } from "@/core/config/env/server";

export type UmamiTopPage = Readonly<{
  path: string;
  views: number;
  delta: number;
}>;

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
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Umami metrics request failed with status ${response.status}: ${body}`);
  }

  const metrics = (await response.json()) as UmamiMetric[];
  return new Map(metrics.map((metric) => [metric.x, metric.y]));
}

/**
 * Top 5 pages par visiteurs sur les 7 derniers jours, avec variation vs les
 * 7 jours précédents. Retourne `null` en cas d'échec réseau/API — jamais de
 * throw, l'appelant retombe sur le mock existant.
 */
export async function fetchUmamiTopPages(): Promise<UmamiTopPage[] | null> {
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
    console.error("[umami] échec de récupération des pages les plus visitées", error);
    return null;
  }
}
