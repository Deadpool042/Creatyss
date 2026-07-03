"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";
import { updateShippingZoneSchema } from "@/features/admin/settings/schemas/shipping-zone.schema";

export async function updateShippingZoneAction(formData: FormData): Promise<void> {
  await requireAdminCapability("admin.settings.shipping.write");

  const id = String(formData.get("id") ?? "").trim();
  const rawDescription = String(formData.get("description") ?? "").trim();

  const parsed = updateShippingZoneSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    description: rawDescription.length > 0 ? rawDescription : undefined,
  });

  if (!id || !parsed.success) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=invalid_input`);
  }

  const data = parsed.data;

  try {
    await db.shippingZone.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description ?? null,
      },
    });
  } catch (error) {
    console.error(error);
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=update_failed`);
  }

  revalidatePath(ADMIN_SHIPPING_SETTINGS_PATH);
  redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_updated=1`);
}
