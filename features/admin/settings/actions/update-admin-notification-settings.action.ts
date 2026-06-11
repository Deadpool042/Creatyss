"use server";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { revalidatePath } from "next/cache";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  NotificationSettingsSchema,
  type NotificationSettingsFormState,
} from "@/features/admin/settings/schemas/notification-settings.schema";

export async function updateAdminNotificationSettingsAction(
  _prevState: NotificationSettingsFormState,
  formData: FormData
): Promise<NotificationSettingsFormState> {
  await requireAdminCapability("admin.settings.notifications.write");

  const raw = {
    emailConfirmationEnabled: formData.get("emailConfirmationEnabled"),
    emailShippingEnabled: formData.get("emailShippingEnabled"),
    replyToEmail: formData.get("replyToEmail"),
  };

  const parsed = NotificationSettingsSchema.safeParse(raw);

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

    const { emailConfirmationEnabled, emailShippingEnabled, replyToEmail } = parsed.data;

    await db.store.update({
      where: { id: storeId },
      data: {
        emailConfirmationEnabled,
        emailShippingEnabled,
        replyToEmail: replyToEmail ?? null,
      },
    });

    revalidatePath("/admin/settings/notifications");

    return { status: "success", message: "Réglages notifications enregistrés." };
  } catch (error) {
    console.error("[notification-settings]", error);
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
