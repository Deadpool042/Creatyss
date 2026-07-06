import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

/**
 * Tracking storefront anonyme sans cookie (décision produit — lot
 * `docs/roadmap/h3-administration-avancee/lot-analytics-tracking-reel.md`) :
 * - compteurs agrégés côté serveur uniquement (aucun identifiant personnel,
 *   aucune IP, aucun cookie → pas de consentement RGPD requis) ;
 * - un `AnalyticsSnapshot` par jour UTC et par métrique, incrémenté par
 *   upsert (pas d'écriture brute par événement) ;
 * - collecte gatée par le flag `engagement.tracking` (domaine `tracking`,
 *   séparé de `engagement.analytics` qui gouverne l'exposition admin des
 *   lectures — cf. `docs/roadmap/analyses-cockpit-analytique/lot-6-tracking-dashboarding-cadrage.md`) :
 *   flag inactif → aucune écriture.
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
  searchTermQuery: {
    code: "storefront.search_term_queries",
    name: "Recherches par terme",
    description:
      "Nombre de recherches storefront par terme normalisé (agrégat quotidien anonyme, sans identifiant de session).",
  },
  searchZeroResults: {
    code: "storefront.search_zero_results",
    name: "Recherches sans résultat",
    description:
      "Nombre de recherches storefront n'ayant retourné aucun résultat (agrégat quotidien anonyme).",
  },
} as const;

export type StorefrontAnalyticsEventType = keyof typeof STOREFRONT_ANALYTICS_METRICS;

export const STOREFRONT_ANALYTICS_METRIC_TYPE = "counter";
export const STOREFRONT_ANALYTICS_DIMENSION_TYPE = "total";
export const STOREFRONT_ANALYTICS_DIMENSION_KEY = "all";
export const STOREFRONT_ANALYTICS_SOURCE_REF = "storefront.tracking";

const TRACKING_FEATURE_CODE = "engagement.tracking";

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

export type StorefrontAnalyticsDimension = Readonly<{ type: string; key: string }>;

const DEFAULT_DIMENSION: StorefrontAnalyticsDimension = {
  type: STOREFRONT_ANALYTICS_DIMENSION_TYPE,
  key: STOREFRONT_ANALYTICS_DIMENSION_KEY,
};

/**
 * Incrémente le compteur quotidien agrégé pour l'événement storefront donné.
 * `dimension` par défaut `("total", "all")` — inchangé pour `productView` et
 * `cartAddition`. Une dimension explicite (ex. `("term", "<terme>")`) permet
 * d'agréger par sous-clé sans introduire d'identifiant de session.
 *
 * Peut lancer une erreur (DB indisponible, etc.) : les points d'accroche
 * storefront doivent passer par `trackStorefrontAnalyticsEvent`, qui ne
 * propage jamais l'erreur au parcours client.
 */
export async function recordStorefrontAnalyticsEvent(
  eventType: StorefrontAnalyticsEventType,
  now: Date = new Date(),
  dimension: StorefrontAnalyticsDimension = DEFAULT_DIMENSION
): Promise<void> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return;
  }

  const featureActive = await meetsFeatureLevel(TRACKING_FEATURE_CODE, "active", { storeId });

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
          dimensionType: dimension.type,
          dimensionKey: dimension.key,
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
        dimensionType: dimension.type,
        dimensionKey: dimension.key,
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

const SEARCH_TERM_DIMENSION_TYPE = "term";
const SEARCH_TERM_MAX_LENGTH = 100;

/**
 * Normalise un terme de recherche pour usage comme `dimensionKey` : trim,
 * minuscule, troncature — évite d'exploser l'index avec des variantes
 * triviales (casse, espaces) ou du texte anormalement long.
 */
export function normalizeSearchTerm(rawTerm: string): string {
  return rawTerm.trim().toLowerCase().slice(0, SEARCH_TERM_MAX_LENGTH);
}

/**
 * Variante fire-and-forget pour une recherche storefront exécutée : compte
 * la recherche par terme normalisé, et incrémente le compteur "sans
 * résultat" si `resultCount` est nul. N'effectue aucune écriture si le terme
 * est vide après normalisation.
 */
export function trackStorefrontSearchEvent(searchTerm: string, resultCount: number): void {
  const normalizedTerm = normalizeSearchTerm(searchTerm);

  if (normalizedTerm.length === 0) {
    return;
  }

  void recordStorefrontAnalyticsEvent("searchTermQuery", new Date(), {
    type: SEARCH_TERM_DIMENSION_TYPE,
    key: normalizedTerm,
  }).catch((error) => {
    console.error('[analytics] tracking "searchTermQuery" failed', error);
  });

  if (resultCount === 0) {
    trackStorefrontAnalyticsEvent("searchZeroResults");
  }
}
