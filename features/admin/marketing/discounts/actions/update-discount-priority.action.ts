"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { getAdminDiscountDetailPath } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";

export type UpdateDiscountPriorityResult =
  | { ok: true; newPriority: number }
  | { ok: false; error: string };

/**
 * Met à jour la `priority` d'un `Discount` automatique.
 * Guard serveur : refuse si `isAutomatic === false`.
 * Gaté `automationLevelMet` — le contrôle d'accès est délégué à la page.
 */
export async function updateDiscountPriorityAction(
  discountId: string,
  priority: number
): Promise<UpdateDiscountPriorityResult> {
  await requireAuthenticatedAdmin();

  if (!Number.isInteger(priority) || priority < 0) {
    return { ok: false, error: "La priorité doit être un entier positif ou nul." };
  }

  const automationLevelMet = await meetsFeatureLevel("commerce.discounts", "automation");
  if (!automationLevelMet) {
    return { ok: false, error: "Le niveau actuel n'autorise pas la priorite." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { ok: false, error: "Aucune boutique courante." };
  }

  const discount = await db.discount.findFirst({
    where: { id: discountId, storeId, archivedAt: null },
    select: { id: true, isAutomatic: true, archivedAt: true },
  });

  if (!discount) {
    return { ok: false, error: "Remise introuvable." };
  }

  if (!discount.isAutomatic) {
    return {
      ok: false,
      error: "La priorité ne peut être modifiée que pour les remises automatiques.",
    };
  }

  await db.discount.update({
    where: { id: discountId },
    data: { priority },
  });

  revalidatePath(getAdminDiscountDetailPath(discountId));

  return { ok: true, newPriority: priority };
}
