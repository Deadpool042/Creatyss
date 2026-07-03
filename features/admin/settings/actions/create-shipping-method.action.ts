"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";
import { createShippingMethodSchema } from "@/features/admin/settings/schemas/shipping-method.schema";
import type { CurrencyCode } from "@/prisma-generated/client";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createShippingMethodAction(formData: FormData): Promise<void> {
  await requireAdminCapability("admin.settings.shipping.write");

  const parsed = createShippingMethodSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    shippingZoneId: String(formData.get("shippingZoneId") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    currencyCode: String(formData.get("currencyCode") ?? ""),
    minSubtotalAmount: String(formData.get("minSubtotalAmount") ?? ""),
    maxSubtotalAmount: String(formData.get("maxSubtotalAmount") ?? ""),
    isDefault: formData.get("isDefault"),
  });

  if (!parsed.success) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=missing_store`);
  }

  const data = parsed.data;

  const zone = await db.shippingZone.findFirst({
    where: { id: data.shippingZoneId, storeId },
    select: { id: true },
  });
  if (zone === null) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=zone_not_found`);
  }

  try {
    await db.shippingMethod.create({
      data: {
        storeId,
        shippingZoneId: data.shippingZoneId,
        code: data.code.toUpperCase(),
        name: data.name,
        amount: data.amount,
        currencyCode: data.currencyCode as CurrencyCode,
        minSubtotalAmount: data.minSubtotalAmount ?? null,
        maxSubtotalAmount: data.maxSubtotalAmount ?? null,
        isDefault: data.isDefault,
        status: "ACTIVE",
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=duplicate_code`);
    }
    console.error(error);
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=create_failed`);
  }

  revalidatePath(ADMIN_SHIPPING_SETTINGS_PATH);
  redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_created=1`);
}
