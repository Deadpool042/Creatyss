"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { isTransitionAllowed, type StatusTransitionMap } from "@/core/shared/status-transitions";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";

type ShippingZoneStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

const ALLOWED_TRANSITIONS: StatusTransitionMap<ShippingZoneStatus> = {
  ACTIVE: ["INACTIVE", "ARCHIVED"],
  INACTIVE: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: [],
};

export async function updateShippingZoneStatusAction(formData: FormData): Promise<void> {
  await requireAdminCapability("admin.settings.shipping.write");

  const id = String(formData.get("id") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim() as ShippingZoneStatus;

  if (!id || !["ACTIVE", "INACTIVE", "ARCHIVED"].includes(nextStatus)) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=invalid_input`);
  }

  const zone = await db.shippingZone.findUnique({
    where: { id },
    select: { status: true },
  });

  if (zone === null) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=not_found`);
  }

  if (!isTransitionAllowed(ALLOWED_TRANSITIONS, zone.status, nextStatus)) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=invalid_transition`);
  }

  try {
    await db.shippingZone.update({
      where: { id },
      data: {
        status: nextStatus,
        ...(nextStatus === "ARCHIVED" ? { archivedAt: new Date() } : {}),
      },
    });
  } catch (error) {
    console.error(error);
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_error=update_failed`);
  }

  revalidatePath(ADMIN_SHIPPING_SETTINGS_PATH);
  redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sz_updated=1`);
}
