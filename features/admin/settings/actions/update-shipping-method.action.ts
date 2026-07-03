"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";
import { updateShippingMethodSchema } from "@/features/admin/settings/schemas/shipping-method.schema";

export async function updateShippingMethodAction(formData: FormData): Promise<void> {
  await requireAdminCapability("admin.settings.shipping.write");

  const id = String(formData.get("id") ?? "").trim();

  const parsed = updateShippingMethodSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    minSubtotalAmount: String(formData.get("minSubtotalAmount") ?? ""),
    maxSubtotalAmount: String(formData.get("maxSubtotalAmount") ?? ""),
    isDefault: formData.get("isDefault"),
  });

  if (!id || !parsed.success) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=invalid_input`);
  }

  const data = parsed.data;

  try {
    await db.shippingMethod.update({
      where: { id },
      data: {
        name: data.name,
        amount: data.amount,
        minSubtotalAmount: data.minSubtotalAmount ?? null,
        maxSubtotalAmount: data.maxSubtotalAmount ?? null,
        isDefault: data.isDefault,
      },
    });
  } catch (error) {
    console.error(error);
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=update_failed`);
  }

  revalidatePath(ADMIN_SHIPPING_SETTINGS_PATH);
  redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_updated=1`);
}
