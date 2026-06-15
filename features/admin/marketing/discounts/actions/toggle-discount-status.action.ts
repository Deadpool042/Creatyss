"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { ADMIN_DISCOUNTS_PATH } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";

export type ToggleDiscountStatusResult =
  | { ok: true; newStatus: string }
  | { ok: false; error: string };

/**
 * Active/désactive un `Discount` (DRAFT/INACTIVE → ACTIVE, ACTIVE →
 * INACTIVE), même logique que `toggleFeatureFlagAction`. Niveau `simple` —
 * n'a aucun effet panier/checkout (cf.
 * `docs/lots/2026-06-13-commerce-discounts-cadrage.md`).
 */
export async function toggleDiscountStatusAction(discountId: string): Promise<ToggleDiscountStatusResult> {
  await requireAuthenticatedAdmin();

  const discount = await db.discount.findUnique({
    where: { id: discountId },
    select: { id: true, status: true, archivedAt: true },
  });

  if (!discount || discount.archivedAt) {
    return { ok: false, error: "Code promo introuvable." };
  }

  const nextStatus = discount.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await db.discount.update({
    where: { id: discountId },
    data: { status: nextStatus },
  });

  revalidatePath(ADMIN_DISCOUNTS_PATH);

  return { ok: true, newStatus: nextStatus };
}
