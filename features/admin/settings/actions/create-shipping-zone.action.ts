"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";
import { createShippingZoneSchema } from "@/features/admin/settings/schemas/shipping-zone.schema";

function isUniqueConstraintError(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "P2002";
}

export async function createShippingZoneAction(formData: FormData): Promise<void> {
  await requireAdminCapability("admin.settings.shipping.write");

  const rawDescription = String(formData.get("description") ?? "").trim();

  const parsed = createShippingZoneSchema.safeParse({
    code: String(formData.get("code") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: rawDescription.length > 0 ? rawDescription : undefined,
  });

  if (!parsed.success) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=invalid_input`);
  }

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=missing_store`);
  }

  const data = parsed.data;

  try {
    await db.shippingZone.create({
      data: {
        storeId,
        code: data.code.toUpperCase(),
        name: data.name,
        description: data.description ?? null,
        status: "ACTIVE",
      },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=duplicate_code`);
    }
    console.error(error);
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=create_failed`);
  }

  revalidatePath(ADMIN_SHIPPING_SETTINGS_PATH);
  redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_created=1`);
}
