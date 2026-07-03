"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";

type ShippingMethodStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED";

const ALLOWED_TRANSITIONS: Record<ShippingMethodStatus, ShippingMethodStatus[]> = {
  DRAFT: ["ACTIVE", "ARCHIVED"],
  ACTIVE: ["INACTIVE", "ARCHIVED"],
  INACTIVE: ["ACTIVE", "ARCHIVED"],
  ARCHIVED: [],
};

export async function updateShippingMethodStatusAction(formData: FormData): Promise<void> {
  await requireAdminCapability("admin.settings.shipping.write");

  const id = String(formData.get("id") ?? "").trim();
  const nextStatus = String(formData.get("nextStatus") ?? "").trim() as ShippingMethodStatus;

  if (!id || !["DRAFT", "ACTIVE", "INACTIVE", "ARCHIVED"].includes(nextStatus)) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=invalid_input`);
  }

  const method = await db.shippingMethod.findUnique({
    where: { id },
    select: { status: true },
  });

  if (method === null) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=not_found`);
  }

  const allowed = ALLOWED_TRANSITIONS[method.status] ?? [];
  if (!allowed.includes(nextStatus)) {
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=invalid_transition`);
  }

  try {
    await db.shippingMethod.update({
      where: { id },
      data: {
        status: nextStatus,
        ...(nextStatus === "ARCHIVED" ? { archivedAt: new Date() } : {}),
      },
    });
  } catch (error) {
    console.error(error);
    redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_error=update_failed`);
  }

  revalidatePath(ADMIN_SHIPPING_SETTINGS_PATH);
  redirect(`${ADMIN_SHIPPING_SETTINGS_PATH}?sm_updated=1`);
}
