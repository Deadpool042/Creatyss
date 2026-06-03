"use server";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";

export type ToggleFeatureFlagResult =
  | { ok: true; newStatus: string }
  | { ok: false; error: string };

export async function toggleFeatureFlagAction(flagId: string): Promise<ToggleFeatureFlagResult> {
  await requireAuthenticatedAdmin();

  const flag = await db.featureFlag.findUnique({
    where: { id: flagId },
    select: { id: true, status: true, archivedAt: true },
  });

  if (!flag || flag.archivedAt) {
    return { ok: false, error: "Feature flag introuvable." };
  }

  // DRAFT/INACTIVE → ACTIVE, ACTIVE → INACTIVE
  const nextStatus = flag.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await db.featureFlag.update({
    where: { id: flagId },
    data: { status: nextStatus as never },
  });

  return { ok: true, newStatus: nextStatus };
}
