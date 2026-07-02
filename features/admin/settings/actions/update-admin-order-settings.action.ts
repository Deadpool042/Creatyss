"use server";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { revalidatePath } from "next/cache";
import { ADMIN_ORDERS_SETTINGS_PATH } from "@/features/admin/commerce/orders/shared/admin-orders-routes";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  orderSettingsSchema,
  type OrderSettingsFormState,
} from "@/features/admin/settings/schemas/order-settings.schema";

export async function updateAdminOrderSettingsAction(
  _prevState: OrderSettingsFormState,
  formData: FormData
): Promise<OrderSettingsFormState> {
  await requireAdminCapability("admin.settings.orders.write");

  const rawPrefix = formData.get("orderNumberPrefix");

  const raw = {
    orderNumberPrefix: rawPrefix !== null && rawPrefix !== "" ? rawPrefix : null,
  };

  const parsed = orderSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<string, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Certains champs sont invalides.",
      fieldErrors,
    };
  }

  try {
    const storeId = await getCurrentStoreId();

    if (storeId === null) {
      return { status: "error", message: "Boutique introuvable." };
    }

    await db.store.update({
      where: { id: storeId },
      data: {
        orderNumberPrefix: parsed.data.orderNumberPrefix ?? null,
      },
    });

    revalidatePath(ADMIN_ORDERS_SETTINGS_PATH);

    return { status: "success", message: "Réglages commandes enregistrés." };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
