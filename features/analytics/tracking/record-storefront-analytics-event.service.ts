import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

/**
 * Tracking storefront anonyme sans cookie (décision produit — lot
 * `docs/roadmap/h3-administration-avancee/lot-analytics-tracking-reel.md`) :
 * - compteurs agrégés côté serveur uniquement (aucun identifiant personnel,
 *   aucune IP, aucun cookie → pas de consentement RGPD requis) ;
 * - un `AnalyticsSnapshot` par jour UTC et par métrique, incrémenté par
 *   upsert (pas d'écriture brute par événement) ;
 * - collecte gatée par le flag `engagement.analytics` : flag inactif →
 *   aucune écriture.
 *
 * Les sessions et visiteurs uniques ne sont pas approximables sans
 * identifiant : ils ne sont volontairement pas collectés.
 */

export const STOREFRONT_ANALYTICS_METRICS = {
  productView: {
    code: "storefront.product_views",
    name: "Vues produit",
    description: "Nombre de pages produit affichées sur le storefront (agrégat quotidien anonyme).",
  },
  cartAddition: {
    code: "storefront.cart_additions",
    name: "Ajouts panier",
    description: "Nombre d'ajouts au panier réussis sur le storefront (agrégat quotidien anonyme).",
  },
} as const;

export type StorefrontAnalyticsEventType = keyof typeof STOREFRONT_ANALYTICS_METRICS;

export const STOREFRONT_ANALYTICS_METRIC_TYPE = "counter";
export const STOREFRONT_ANALYTICS_DIMENSION_TYPE = "total";
export const STOREFRONT_ANALYTICS_DIMENSION_KEY = "all";
export const STOREFRONT_ANALYTICS_SOURCE_REF = "storefront.tracking";

const ANALYTICS_FEATURE_CODE = "engagement.analytics";

export function getUtcDayRange(now: Date): { periodStart: Date; periodEnd: Date } {
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const periodEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );

  return { periodStart, periodEnd };
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

/**
 * Incrémente le compteur quotidien agrégé pour l'événement storefront donné.
 *
 * Peut lancer une erreur (DB indisponible, etc.) : les points d'accroche
 * storefront doivent passer par `trackStorefrontAnalyticsEvent`, qui ne
 * propage jamais l'erreur au parcours client.
 */
export async function recordStorefrontAnalyticsEvent(
  eventType: StorefrontAnalyticsEventType,
  now: Date = new Date()
): Promise<void> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return;
  }

  const featureActive = await queryFeatureFlagActive(ANALYTICS_FEATURE_CODE, { storeId });

  if (!featureActive) {
    return;
  }

  const metricDefinition = STOREFRONT_ANALYTICS_METRICS[eventType];
  const { periodStart, periodEnd } = getUtcDayRange(now);

  const metric = await db.analyticsMetric.upsert({
    where: {
      storeId_code: {
        storeId,
        code: metricDefinition.code,
      },
    },
    update: {},
    create: {
      storeId,
      code: metricDefinition.code,
      name: metricDefinition.name,
      description: metricDefinition.description,
      metricType: STOREFRONT_ANALYTICS_METRIC_TYPE,
      status: "ACTIVE",
    },
    select: { id: true },
  });

  const upsertDailySnapshot = () =>
    db.analyticsSnapshot.upsert({
      where: {
        analyticsMetricId_dimensionType_dimensionKey_periodStart_periodEnd: {
          analyticsMetricId: metric.id,
          dimensionType: STOREFRONT_ANALYTICS_DIMENSION_TYPE,
          dimensionKey: STOREFRONT_ANALYTICS_DIMENSION_KEY,
          periodStart,
          periodEnd,
        },
      },
      update: {
        valueInteger: { increment: 1 },
        computedAt: now,
      },
      create: {
        analyticsMetricId: metric.id,
        dimensionType: STOREFRONT_ANALYTICS_DIMENSION_TYPE,
        dimensionKey: STOREFRONT_ANALYTICS_DIMENSION_KEY,
        periodStart,
        periodEnd,
        valueInteger: 1,
        status: "READY",
        sourceRef: STOREFRONT_ANALYTICS_SOURCE_REF,
        computedAt: now,
      },
      select: { id: true },
    });

  try {
    await upsertDailySnapshot();
  } catch (error) {
    // Deux requêtes concurrentes peuvent tenter le `create` du même jour :
    // au second essai, la ligne existe et l'upsert prend la branche update.
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    await upsertDailySnapshot();
  }
}

/**
 * Variante fire-and-forget pour les parcours storefront : ne bloque pas le
 * rendu ni l'action, ne propage jamais d'erreur au client.
 */
export function trackStorefrontAnalyticsEvent(eventType: StorefrontAnalyticsEventType): void {
  void recordStorefrontAnalyticsEvent(eventType).catch((error) => {
    console.error(`[analytics] tracking "${eventType}" failed`, error);
  });
}
