"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createDiscountSchema } from "@/features/admin/marketing/discounts/schemas/create-discount.schema";
import { ADMIN_DISCOUNTS_PATH } from "@/features/admin/marketing/discounts/shared/admin-discounts-routes";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

/**
 * Crée un `Discount` borné au scope `ORDER` :
 * - manuel à partir du niveau `simple`
 * - automatique à partir du niveau `automation`
 *
 * Cf. `docs/lots/2026-06-15-commerce-discounts-automation-cadrage.md`.
 */
export async function createDiscountAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  const typeValue = String(formData.get("type") ?? "");
  const percentageRaw = String(formData.get("percentageValue") ?? "").trim();
  const fixedAmountRaw = String(formData.get("fixedAmountValue") ?? "").trim();
  const descriptionRaw = String(formData.get("description") ?? "").trim();
  const automaticRequested = formData.get("isAutomatic") === "on";
  const automationEnabled = await meetsFeatureLevel("commerce.discounts", "automation");

  if (automaticRequested && !automationEnabled) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=automation_unavailable`);
  }

  const parsed = createDiscountSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: descriptionRaw.length > 0 ? descriptionRaw : null,
    type: typeValue === "FIXED_AMOUNT" ? "FIXED_AMOUNT" : "PERCENTAGE",
    isAutomatic: automationEnabled && automaticRequested,
    percentageValue: percentageRaw.length > 0 ? Number(percentageRaw) : null,
    fixedAmountValue: fixedAmountRaw.length > 0 ? Number(fixedAmountRaw) : null,
  });

  if (!parsed.success) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=missing_store`);
  }

  const data = parsed.data;

  try {
    if (data.type === "PERCENTAGE") {
      await db.discount.create({
        data: {
          storeId,
          code: data.code.toUpperCase(),
          name: data.name,
          description: data.description,
          isAutomatic: data.isAutomatic,
          type: "PERCENTAGE",
          percentageValue: data.percentageValue,
        },
      });
    } else {
      const store = await db.store.findUnique({
        where: { id: storeId },
        select: { defaultCurrency: true },
      });

      await db.discount.create({
        data: {
          storeId,
          code: data.code.toUpperCase(),
          name: data.name,
          description: data.description,
          isAutomatic: data.isAutomatic,
          type: "FIXED_AMOUNT",
          fixedAmountValue: data.fixedAmountValue,
          currencyCode: store?.defaultCurrency ?? "EUR",
        },
      });
    }
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=duplicate_code`);
    }

    console.error(error);
    redirect(`${ADMIN_DISCOUNTS_PATH}?discount_error=create_failed`);
  }

  revalidatePath(ADMIN_DISCOUNTS_PATH);
  redirect(`${ADMIN_DISCOUNTS_PATH}?discount_created=1`);
}
