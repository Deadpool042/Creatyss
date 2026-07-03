"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { isTransitionAllowed, type StatusTransitionMap } from "@/core/shared/status-transitions";
import { ADMIN_PRICING_PATH } from "@/features/admin/catalog/shared/admin-pricing-routes";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

type TargetStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";
type PriceListStatus = "DRAFT" | TargetStatus;

const ALLOWED_TRANSITIONS: StatusTransitionMap<PriceListStatus> = {
  DRAFT: ["ACTIVE", "ARCHIVED"],
  ACTIVE: ["INACTIVE", "ARCHIVED"],
  INACTIVE: ["ACTIVE", "ARCHIVED"],
};

export async function updatePriceListStatusAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  if (!(await meetsFeatureLevel("catalog.products.pricing", "price-lists"))) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=pricing_level_insufficient`);
  }

  const id = String(formData.get("id") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim() as TargetStatus;

  if (!id || !["ACTIVE", "INACTIVE", "ARCHIVED"].includes(nextStatus)) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=invalid_input`);
  }

  const priceList = await db.priceList.findUnique({
    where: { id },
    select: { status: true, isDefault: true },
  });

  if (priceList === null) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=not_found`);
  }

  if (!isTransitionAllowed(ALLOWED_TRANSITIONS, priceList.status as PriceListStatus, nextStatus)) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=invalid_transition`);
  }

  try {
    const willLoseDefault = nextStatus === "ARCHIVED" || nextStatus === "INACTIVE";
    await db.priceList.update({
      where: { id },
      data: {
        status: nextStatus,
        isDefault: willLoseDefault ? false : priceList.isDefault,
        ...(nextStatus === "ARCHIVED" ? { archivedAt: new Date() } : {}),
      },
    });
  } catch (error) {
    console.error(error);
    redirect(`${ADMIN_PRICING_PATH}?pl_error=update_failed`);
  }

  revalidatePath(ADMIN_PRICING_PATH);
  redirect(`${ADMIN_PRICING_PATH}?pl_updated=1`);
}
