"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createTaxRuleSchema } from "@/features/admin/commerce/taxation/schemas/create-tax-rule.schema";
import { ADMIN_TAXATION_PATH } from "@/features/admin/commerce/taxation/shared/admin-taxation-routes";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createTaxRuleAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  const regionRaw = String(formData.get("regionCode") ?? "");
  const rateRaw = String(formData.get("ratePercent") ?? "").trim();

  const parsed = createTaxRuleSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    regionCode: regionRaw === "METRO" || regionRaw === "" ? null : regionRaw,
    ratePercent: rateRaw.length > 0 ? Number(rateRaw) : Number.NaN,
  });

  if (!parsed.success) {
    redirect(`${ADMIN_TAXATION_PATH}?tax_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    redirect(`${ADMIN_TAXATION_PATH}?tax_error=missing_store`);
  }

  const data = parsed.data;

  try {
    await db.taxRule.create({
      data: {
        storeId,
        code: data.code.toUpperCase(),
        name: data.name,
        status: "ACTIVE",
        scopeType: "STORE",
        countryCode: "FR",
        regionCode: data.regionCode,
        ratePercent: data.ratePercent,
        isIncludedInPrice: true,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_TAXATION_PATH}?tax_error=duplicate_code`);
    }
    console.error(error);
    redirect(`${ADMIN_TAXATION_PATH}?tax_error=create_failed`);
  }

  revalidatePath(ADMIN_TAXATION_PATH);
  redirect(`${ADMIN_TAXATION_PATH}?tax_created=1`);
}
