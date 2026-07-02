"use server";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { revalidatePath } from "next/cache";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { ADMIN_SHIPPING_SETTINGS_PATH } from "@/features/admin/commerce/shipping/shared/admin-shipping-routes";
import type { CurrencyCode } from "@/prisma-generated/client";
import {
  shippingSettingsSchema,
  type ShippingSettingsFormState,
} from "@/features/admin/settings/schemas/shipping-settings.schema";

export async function updateAdminShippingSettingsAction(
  _prevState: ShippingSettingsFormState,
  formData: FormData
): Promise<ShippingSettingsFormState> {
  await requireAdminCapability("admin.settings.shipping.write");

  const raw = {
    standardShippingAmount: formData.get("standardShippingAmount"),
    freeShippingThreshold: formData.get("freeShippingThreshold"),
    currencyCode: formData.get("currencyCode"),
  };

  const parsed = shippingSettingsSchema.safeParse(raw);

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
      standardShippingAmount,
      freeShippingThreshold,
      currencyCode: currencyCodeRaw,
    } = parsed.data;
    const currencyCode = currencyCodeRaw as CurrencyCode;

    // Upsert ShippingZone "FR"
    const zone = await db.shippingZone.upsert({
      where: { storeId_code: { storeId, code: "FR" } },
      create: {
        code: "FR",
        name: "France",
        status: "ACTIVE",
        storeId,
      },
      update: {},
    });

    // Upsert ShippingMethod "STANDARD"
    await db.shippingMethod.upsert({
      where: { storeId_code: { storeId, code: "STANDARD" } },
      create: {
        code: "STANDARD",
        name: "Livraison standard",
        amount: standardShippingAmount,
        currencyCode,
        isDefault: true,
        status: "ACTIVE",
        shippingZoneId: zone.id,
        storeId,
      },
      update: {
        name: "Livraison standard",
        amount: standardShippingAmount,
        currencyCode,
        isDefault: true,
        status: "ACTIVE",
        shippingZoneId: zone.id,
      },
    });

    // Upsert ou désactiver ShippingMethod "FREE"
    if (freeShippingThreshold !== null) {
      await db.shippingMethod.upsert({
        where: { storeId_code: { storeId, code: "FREE" } },
        create: {
          code: "FREE",
          name: "Livraison offerte",
          amount: 0,
          currencyCode,
          minSubtotalAmount: freeShippingThreshold,
          isDefault: false,
          status: "ACTIVE",
          shippingZoneId: zone.id,
          storeId,
        },
        update: {
          name: "Livraison offerte",
          amount: 0,
          currencyCode,
          minSubtotalAmount: freeShippingThreshold,
          isDefault: false,
          status: "ACTIVE",
          shippingZoneId: zone.id,
        },
      });
    } else {
      const existingFree = await db.shippingMethod.findFirst({
        where: { storeId, code: "FREE" },
        select: { id: true },
      });
      if (existingFree) {
        await db.shippingMethod.update({
          where: { id: existingFree.id },
          data: { status: "INACTIVE" },
        });
      }
    }

    revalidatePath(ADMIN_SHIPPING_SETTINGS_PATH);

    return { status: "success", message: "Réglages livraison enregistrés." };
  } catch (error) {
    console.error("[shipping-settings]", error);
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
