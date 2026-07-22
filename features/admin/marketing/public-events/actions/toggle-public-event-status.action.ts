"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import {
  ADMIN_PUBLIC_EVENTS_PATH,
  getAdminPublicEventDetailPath,
} from "@/features/admin/marketing/public-events/shared/admin-public-events-routes";
import { recordPublicEventCreatedDomainEvent } from "@/features/admin/marketing/public-events/services/record-public-event-domain-events";

export type TogglePublicEventStatusResult =
  | { ok: true; newStatus: string }
  | { ok: false; error: string };

/**
 * Active/désactive un `PublicEvent` (DRAFT/INACTIVE → ACTIVE, ACTIVE →
 * INACTIVE), même logique que `toggleDiscountStatusAction`.
 */
export async function togglePublicEventStatusAction(
  publicEventId: string
): Promise<TogglePublicEventStatusResult> {
  await requireAuthenticatedAdmin();

  const publicEvent = await db.publicEvent.findUnique({
    where: { id: publicEventId },
    select: {
      id: true,
      status: true,
      archivedAt: true,
      storeId: true,
      slug: true,
      title: true,
      startsAt: true,
    },
  });

  if (!publicEvent || publicEvent.archivedAt) {
    return { ok: false, error: "Marché introuvable." };
  }

  const wasActive = publicEvent.status === "ACTIVE";
  const nextStatus = wasActive ? "INACTIVE" : "ACTIVE";

  const updated = await db.publicEvent.update({
    where: { id: publicEventId },
    data: { status: nextStatus },
  });

  // Premier passage à ACTIVE = publication effective du marché : c'est ce
  // moment, pas la création (DRAFT par défaut), qui doit proposer une
  // diffusion newsletter/social — cf. correction post-revue PR #17.
  if (!wasActive && nextStatus === "ACTIVE") {
    await recordPublicEventCreatedDomainEvent({
      storeId: publicEvent.storeId,
      publicEvent: {
        id: updated.id,
        slug: publicEvent.slug,
        title: publicEvent.title,
        startsAt: publicEvent.startsAt,
        updatedAt: updated.updatedAt,
      },
    });
  }

  revalidatePath(ADMIN_PUBLIC_EVENTS_PATH);
  revalidatePath(getAdminPublicEventDetailPath(publicEventId));

  return { ok: true, newStatus: nextStatus };
}
