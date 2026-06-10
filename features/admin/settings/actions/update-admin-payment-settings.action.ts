"use server";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { revalidatePath } from "next/cache";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  PaymentSettingsSchema,
  type PaymentSettingsFormState,
} from "@/features/admin/settings/schemas/payment-settings.schema";

export async function updateAdminPaymentSettingsAction(
  _prevState: PaymentSettingsFormState,
  formData: FormData
): Promise<PaymentSettingsFormState> {
  await requireAdminCapability("admin.settings.payments.write");

  const raw = {
    bankTransferEnabled: formData.get("bankTransferEnabled"),
    cashOnDeliveryEnabled: formData.get("cashOnDeliveryEnabled"),
    bankTransferInstructions: formData.get("bankTransferInstructions"),
    cashOnDeliveryInstructions: formData.get("cashOnDeliveryInstructions"),
  };

  const parsed = PaymentSettingsSchema.safeParse(raw);

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

    const {
      bankTransferEnabled,
      cashOnDeliveryEnabled,
      bankTransferInstructions,
      cashOnDeliveryInstructions,
    } = parsed.data;

    await db.store.update({
      where: { id: storeId },
      data: {
        bankTransferEnabled,
        cashOnDeliveryEnabled,
        bankTransferInstructions: bankTransferInstructions ?? null,
        cashOnDeliveryInstructions: cashOnDeliveryInstructions ?? null,
      },
    });

    revalidatePath("/admin/settings/payments");

    return { status: "success", message: "Réglages paiements enregistrés." };
  } catch (error) {
    console.error("[payment-settings]", error);
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
