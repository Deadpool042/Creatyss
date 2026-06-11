"use server";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  storeSettingsSchema,
  type StoreSettingsFormState,
} from "@/features/admin/settings/schemas/store-settings.schema";

export async function updateAdminStoreSettingsAction(
  _prevState: StoreSettingsFormState,
  formData: FormData
): Promise<StoreSettingsFormState> {
  await requireAdminCapability("admin.settings.general.write");

  const raw = {
    name: formData.get("name"),
    legalName: formData.get("legalName") || null,
    siret: formData.get("siret"),
    vatNumber: formData.get("vatNumber"),
    supportEmail: formData.get("supportEmail") || null,
    supportPhone: formData.get("supportPhone") || null,
    shippingReturnsPolicy: formData.get("shippingReturnsPolicy") || null,
    defaultCurrency: formData.get("defaultCurrency"),
    timezone: formData.get("timezone"),
    defaultLocaleCode: formData.get("defaultLocaleCode"),
    addressLine1: formData.get("addressLine1"),
    addressCity: formData.get("addressCity"),
    addressPostalCode: formData.get("addressPostalCode"),
    addressCountry: formData.get("addressCountry"),
    instagramUrl: formData.get("instagramUrl"),
    facebookUrl: formData.get("facebookUrl"),
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
    const storeId = await getCurrentStoreId();

    if (storeId === null) {
      return { status: "error", message: "Boutique introuvable." };
    }

    await db.store.update({
      where: { id: storeId },
      data: {
        name: parsed.data.name,
        legalName: parsed.data.legalName ?? null,
        siret: parsed.data.siret ?? null,
        vatNumber: parsed.data.vatNumber ?? null,
        supportEmail: parsed.data.supportEmail || null,
        supportPhone: parsed.data.supportPhone ?? null,
        shippingReturnsPolicy: parsed.data.shippingReturnsPolicy ?? null,
        defaultCurrency: parsed.data.defaultCurrency as never,
        timezone: parsed.data.timezone,
        defaultLocaleCode: parsed.data.defaultLocaleCode,
        addressLine1: parsed.data.addressLine1 ?? null,
        addressCity: parsed.data.addressCity ?? null,
        addressPostalCode: parsed.data.addressPostalCode ?? null,
        addressCountry: parsed.data.addressCountry ?? null,
        instagramUrl: parsed.data.instagramUrl ?? null,
        facebookUrl: parsed.data.facebookUrl ?? null,
      },
    });

    return { status: "success", message: "Réglages enregistrés." };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
