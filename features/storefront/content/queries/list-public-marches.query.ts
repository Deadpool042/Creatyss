import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { queryFeatureFlagActive } from "@/features/feature-flags/queries/query-feature-flag-active";

export type PublicMarche = {
  id: string;
  title: string;
  shortDescription: string | null;
  startsAt: Date;
  endsAt: Date | null;
  locationName: string | null;
  locationAddress: string | null;
  hasSpecialConditions: boolean;
  specialConditionsNote: string | null;
};

/**
 * Liste les `PublicEvent` ACTIVE du store courant, triés par date de début,
 * pour la page publique `/les-marches`.
 *
 * Retourne un tableau vide si le flag `engagement.public-events` est
 * inactif ou si le store courant ne peut pas être résolu — jamais
 * d'erreur, la page conserve alors son placeholder.
 */
export async function listPublicMarches(): Promise<PublicMarche[]> {
  const featureActive = await queryFeatureFlagActive("engagement.public-events");

  if (!featureActive) {
    return [];
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  return db.publicEvent.findMany({
    where: { storeId, archivedAt: null, status: "ACTIVE" },
    orderBy: [{ startsAt: "asc" }],
    select: {
      id: true,
      title: true,
      shortDescription: true,
      startsAt: true,
      endsAt: true,
      locationName: true,
      locationAddress: true,
      hasSpecialConditions: true,
      specialConditionsNote: true,
    },
  });
}
