"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { getAdminDiscountDetailPath } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";

export type ToggleDiscountCodeStatusResult =
  | { ok: true; newStatus: string }
  | { ok: false; error: string };

/**
 * Active/désactive un `DiscountCode` secondaire (ACTIVE ↔ INACTIVE).
 * Gaté `rulesLevelMet` — le contrôle d'accès est délégué à la page (Server
 * Component) qui conditionne l'affichage du bouton.
 */
export async function toggleDiscountCodeStatusAction(
  discountId: string,
  discountCodeId: string
): Promise<ToggleDiscountCodeStatusResult> {
  await requireAuthenticatedAdmin();

  const rulesLevelMet = await meetsFeatureLevel("commerce.discounts", "rules");
  if (!rulesLevelMet) {
    return { ok: false, error: "Le niveau actuel n'autorise pas les codes secondaires." };
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return { ok: false, error: "Aucune boutique courante." };
  }

  const discountCode = await db.discountCode.findFirst({
    where: { id: discountCodeId, discountId, archivedAt: null, discount: { storeId } },
    select: { id: true, status: true, archivedAt: true },
  });

  if (!discountCode) {
    return { ok: false, error: "Code secondaire introuvable." };
  }

  const nextStatus = discountCode.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await db.discountCode.update({
    where: { id: discountCodeId },
    data: { status: nextStatus },
  });

  revalidatePath(getAdminDiscountDetailPath(discountId));

  return { ok: true, newStatus: nextStatus };
}
