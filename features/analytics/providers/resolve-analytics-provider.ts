import "server-only";

import { isUmamiConfigured } from "@/core/config/env/umami";

import type { AnalyticsProvider } from "./analytics-provider.types";
import { NoneAnalyticsProvider } from "./none-analytics-provider";
import { UmamiAnalyticsProvider } from "./umami-analytics-provider";

const noneAnalyticsProvider = new NoneAnalyticsProvider();
const umamiAnalyticsProvider = new UmamiAnalyticsProvider();

/**
 * Résout le provider analytics actif. Umami est aujourd'hui le seul
 * provider externe, mais un appelant ne doit jamais importer
 * `UmamiAnalyticsProvider` directement — cette factory est le seul point
 * d'entrée, à l'image de `resolveEmailProvider` (`features/email/providers/
 * resolve-email-provider.ts`).
 */
export function getAnalyticsClient(): AnalyticsProvider {
  if (isUmamiConfigured()) {
    return umamiAnalyticsProvider;
  }

  return noneAnalyticsProvider;
}
