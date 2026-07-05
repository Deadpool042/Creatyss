import "server-only";

import { db } from "@/core/db";
import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

import { PRODUCT_SEARCH_SUBJECT_TYPE } from "@/features/search/services/sync-product-search-document.service";

const MAX_SEARCH_RESULTS = 200;

/**
 * Résout les ids produits correspondant au mot-clé via FTS français.
 * Retourne null quand satellite.search est inactif : l'appelant conserve
 * alors le fallback ILIKE existant (aucune régression flag OFF).
 */
export async function searchPublishedProductIds(searchQuery: string): Promise<string[] | null> {
  const featureActive = await queryFeatureFlagActive("satellite.search");

  if (!featureActive) {
    return null;
  }

  const rows = await db.$queryRaw<Array<{ subjectId: string }>>`
    SELECT "subjectId"
    FROM "search_documents"
    WHERE "subjectType" = ${PRODUCT_SEARCH_SUBJECT_TYPE}
      AND "status" = 'ACTIVE'
      AND to_tsvector('french', "indexedText") @@ plainto_tsquery('french', ${searchQuery})
    ORDER BY ts_rank(to_tsvector('french', "indexedText"), plainto_tsquery('french', ${searchQuery})) DESC
    LIMIT ${MAX_SEARCH_RESULTS}
  `;

  return rows.map((row) => row.subjectId);
}
