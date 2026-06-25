"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { createDiscountCodeSchema } from "@/features/admin/marketing/discounts/schemas/create-discount-code.schema";
import {
  ADMIN_DISCOUNTS_PATH,
  getAdminDiscountDetailPath,
} from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

/**
 * Crée un `DiscountCode` secondaire pour un `Discount` existant.
 * Gaté `rulesLevelMet` — refusé côté serveur si le niveau n'est pas atteint.
 */
export async function createDiscountCodeAction(
  discountId: string,
  formData: FormData
): Promise<void> {
  await requireAuthenticatedAdmin();

  const rulesLevelMet = await meetsFeatureLevel("commerce.discounts", "rules");
  const detailPath = getAdminDiscountDetailPath(discountId);

  if (!rulesLevelMet) {
    redirect(`${detailPath}?code_error=rules_unavailable`);
  }

  const codeRaw = String(formData.get("code") ?? "").trim();
  const maxRedemptionsRaw = String(formData.get("maxRedemptions") ?? "").trim();
  const startsAtRaw = String(formData.get("startsAt") ?? "").trim();
  const endsAtRaw = String(formData.get("endsAt") ?? "").trim();

  const parsed = createDiscountCodeSchema.safeParse({
    code: codeRaw,
    maxRedemptions: maxRedemptionsRaw.length > 0 ? Number(maxRedemptionsRaw) : null,
    startsAt: startsAtRaw.length > 0 ? new Date(startsAtRaw) : null,
    endsAt: endsAtRaw.length > 0 ? new Date(endsAtRaw) : null,
  });

  if (!parsed.success) {
    redirect(`${detailPath}?code_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=missing_store`);
  }

  const discount = await db.discount.findFirst({
    where: { id: discountId, storeId, archivedAt: null },
    select: { id: true, archivedAt: true },
  });

  if (!discount) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=not_found`);
  }

  try {
    await db.discountCode.create({
      data: {
        discountId,
        code: parsed.data.code.toUpperCase(),
        maxRedemptions: parsed.data.maxRedemptions,
        startsAt: parsed.data.startsAt,
        endsAt: parsed.data.endsAt,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${detailPath}?code_error=duplicate_code`);
    }

    console.error(error);
    redirect(`${detailPath}?code_error=create_failed`);
  }

  revalidatePath(detailPath);
  redirect(`${detailPath}?code_created=1`);
}
