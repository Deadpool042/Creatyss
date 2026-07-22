import { listAdminFeatureFlags, type AdminFeatureFlagView } from "./list-admin-feature-flags.query";

/**
 * Dégradation gracieuse pour les parallel routes de `settings/advanced`
 * (@list/@detail) : chaque slot est un Server Component indépendant qui
 * doit refetch — pas de point de partage avant rendu côté Next.js.
 * Retourne `[]` plutôt que de faire planter la page si la requête échoue.
 */
export async function loadFeatureFlagsSafe(): Promise<readonly AdminFeatureFlagView[]> {
  try {
    return await listAdminFeatureFlags();
  } catch (error) {
    console.error("[settings/advanced] listAdminFeatureFlags failed", error);
    return [];
  }
}
