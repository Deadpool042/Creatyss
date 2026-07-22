import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminPublicEventDetail = {
  id: string;
  code: string;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "CANCELLED" | "COMPLETED" | "ARCHIVED";
  startsAt: Date;
  endsAt: Date | null;
  locationName: string | null;
  locationAddress: string | null;
  hasSpecialConditions: boolean;
  specialConditionsNote: string | null;
  createdAt: Date;
};

/**
 * Détail d'un `PublicEvent` du store courant, pour la page admin
 * `/admin/marketing/marches/[event]`.
 */
export async function getAdminPublicEventDetail(
  publicEventId: string
): Promise<AdminPublicEventDetail | null> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return null;
  }

  return db.publicEvent.findFirst({
    where: { id: publicEventId, storeId, archivedAt: null },
    select: {
      id: true,
      code: true,
      slug: true,
      title: true,
      shortDescription: true,
      description: true,
      status: true,
      startsAt: true,
      endsAt: true,
      locationName: true,
      locationAddress: true,
      hasSpecialConditions: true,
      specialConditionsNote: true,
      createdAt: true,
    },
  });
}
