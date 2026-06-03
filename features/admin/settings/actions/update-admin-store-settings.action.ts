"use server";

import { db } from "@/core/db";
import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import {
  storeSettingsSchema,
  type StoreSettingsFormState,
} from "@/features/admin/settings/schemas/store-settings.schema";

export async function updateAdminStoreSettingsAction(
  _prevState: StoreSettingsFormState,
  formData: FormData
): Promise<StoreSettingsFormState> {
  await requireAuthenticatedAdmin();

  const raw = {
    name: formData.get("name"),
    legalName: formData.get("legalName") || null,
    supportEmail: formData.get("supportEmail") || null,
    supportPhone: formData.get("supportPhone") || null,
    shippingReturnsPolicy: formData.get("shippingReturnsPolicy") || null,
    defaultCurrency: formData.get("defaultCurrency"),
    timezone: formData.get("timezone"),
    defaultLocaleCode: formData.get("defaultLocaleCode"),
  };

  const parsed = storeSettingsSchema.safeParse(raw);

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
    const store = await db.store.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } });

    if (!store) {
      return { status: "error", message: "Boutique introuvable." };
    }

    await db.store.update({
      where: { id: store.id },
      data: {
        name: parsed.data.name,
        legalName: parsed.data.legalName ?? null,
        supportEmail: parsed.data.supportEmail || null,
        supportPhone: parsed.data.supportPhone ?? null,
        shippingReturnsPolicy: parsed.data.shippingReturnsPolicy ?? null,
        defaultCurrency: parsed.data.defaultCurrency as never,
        timezone: parsed.data.timezone,
        defaultLocaleCode: parsed.data.defaultLocaleCode,
      },
    });

    return { status: "success", message: "Réglages enregistrés." };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
