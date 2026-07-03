"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { createPriceListSchema } from "@/features/admin/catalog/schemas/price-list.schema";
import { ADMIN_PRICING_PATH } from "@/features/admin/catalog/shared/admin-pricing-routes";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function createPriceListAction(formData: FormData): Promise<void> {
  await requireAuthenticatedAdmin();

  if (!(await meetsFeatureLevel("catalog.products.pricing", "price-lists"))) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=pricing_level_insufficient`);
  }

  const rawDescription = String(formData.get("description") ?? "").trim();

  const parsed = createPriceListSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: rawDescription.length > 0 ? rawDescription : undefined,
    currencyCode: String(formData.get("currencyCode") ?? ""),
  });

  if (!parsed.success) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    redirect(`${ADMIN_PRICING_PATH}?pl_error=missing_store`);
  }

  const data = parsed.data;

  try {
    await db.priceList.create({
      data: {
        storeId,
        code: data.code.toUpperCase(),
        name: data.name,
        description: data.description ?? null,
        currencyCode: data.currencyCode,
        status: "DRAFT",
        isDefault: false,
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_PRICING_PATH}?pl_error=duplicate_code`);
    }
    console.error(error);
    redirect(`${ADMIN_PRICING_PATH}?pl_error=create_failed`);
  }

  revalidatePath(ADMIN_PRICING_PATH);
  redirect(`${ADMIN_PRICING_PATH}?pl_created=1`);
}
