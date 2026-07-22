"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import {
  ADMIN_PUBLIC_EVENTS_PATH,
  getAdminPublicEventDetailPath,
} from "@/features/admin/marketing/public-events/shared/admin-public-events-routes";

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
    select: { id: true, status: true, archivedAt: true },
  });

  if (!publicEvent || publicEvent.archivedAt) {
    return { ok: false, error: "Marché introuvable." };
  }

  const nextStatus = publicEvent.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await db.publicEvent.update({
    where: { id: publicEventId },
    data: { status: nextStatus },
  });

  revalidatePath(ADMIN_PUBLIC_EVENTS_PATH);
  revalidatePath(getAdminPublicEventDetailPath(publicEventId));

  return { ok: true, newStatus: nextStatus };
}
