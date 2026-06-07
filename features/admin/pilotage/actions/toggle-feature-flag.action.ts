"use server";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { findFeatureCatalogEntry } from "@/features/admin/pilotage/catalog";

export type ToggleFeatureFlagResult =
  | { ok: true; newStatus: string }
  | { ok: false; error: string };

export async function toggleFeatureFlagAction(flagId: string): Promise<ToggleFeatureFlagResult> {
  await requireAuthenticatedAdmin();

  const flag = await db.featureFlag.findUnique({
    where: { id: flagId },
    select: { id: true, code: true, status: true, archivedAt: true },
  });

  if (!flag || flag.archivedAt) {
    return { ok: false, error: "Feature flag introuvable." };
  }

  const catalogEntry = findFeatureCatalogEntry(flag.code);

  if (!catalogEntry) {
    return { ok: false, error: "Cette fonctionnalité n'est pas référencée dans le catalogue." };
  }

  if (catalogEntry.mutability !== "toggleable") {
    return { ok: false, error: "Cette fonctionnalité ne peut pas être activée/désactivée manuellement." };
  }

  // DRAFT/INACTIVE → ACTIVE, ACTIVE → INACTIVE
  const nextStatus = flag.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await db.featureFlag.update({
    where: { id: flagId },
    data: { status: nextStatus as never },
  });

  return { ok: true, newStatus: nextStatus };
}
