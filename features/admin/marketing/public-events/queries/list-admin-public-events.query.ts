import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

export type AdminPublicEventSummary = {
  id: string;
  code: string;
  slug: string;
  title: string;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "CANCELLED" | "COMPLETED" | "ARCHIVED";
  startsAt: Date;
  endsAt: Date | null;
  locationName: string | null;
  hasSpecialConditions: boolean;
};

/**
 * Liste les `PublicEvent` du store courant (non archivés), triés par date de
 * début, pour la page admin `/admin/marketing/marches`.
 */
export async function listAdminPublicEvents(): Promise<AdminPublicEventSummary[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  return db.publicEvent.findMany({
    where: { storeId, archivedAt: null },
    orderBy: [{ startsAt: "asc" }],
    select: {
      id: true,
      code: true,
      slug: true,
      title: true,
      status: true,
      startsAt: true,
      endsAt: true,
      locationName: true,
      hasSpecialConditions: true,
    },
  });
}
