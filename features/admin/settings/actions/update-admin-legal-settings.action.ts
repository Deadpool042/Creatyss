"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { requireAdminCapability } from "@/core/auth/admin/require-admin-capability";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  LEGAL_PAGE_CODES,
  LEGAL_PAGE_TITLES,
  legalSettingsSchema,
  type LegalSettingsFormState,
  type LegalSettingsInput,
} from "@/features/admin/settings/schemas/legal-settings.schema";

export async function updateAdminLegalSettingsAction(
  _prevState: LegalSettingsFormState,
  formData: FormData
): Promise<LegalSettingsFormState> {
  await requireAdminCapability("admin.settings.legal.write");

  const raw = {
    legalNotice: formData.get("legalNotice") ?? "",
    termsOfSale: formData.get("termsOfSale") ?? "",
    privacyPolicy: formData.get("privacyPolicy") ?? "",
    returnsPolicy: formData.get("returnsPolicy") ?? "",
  };

  const parsed = legalSettingsSchema.safeParse(raw);

  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof LegalSettingsInput, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof LegalSettingsInput;
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

    const entries = [
      { code: LEGAL_PAGE_CODES.legalNotice, body: parsed.data.legalNotice },
      { code: LEGAL_PAGE_CODES.termsOfSale, body: parsed.data.termsOfSale },
      { code: LEGAL_PAGE_CODES.privacyPolicy, body: parsed.data.privacyPolicy },
      { code: LEGAL_PAGE_CODES.returnsPolicy, body: parsed.data.returnsPolicy },
    ] as const;

    await db.$transaction(
      entries.map(({ code, body }) =>
        db.page.upsert({
          where: {
            storeId_code: { storeId, code },
          },
          update: {
            body: body || null,
            isSystemPage: true,
            status: "ACTIVE",
          },
          create: {
            storeId,
            code,
            slug: code,
            title: LEGAL_PAGE_TITLES[code],
            body: body || null,
            status: "ACTIVE",
            isSystemPage: true,
            publishedAt: new Date(),
          },
        })
      )
    );

    revalidatePath("/admin/settings/legal");
    revalidatePath("/mentions-legales");
    revalidatePath("/conditions-generales-de-vente");
    revalidatePath("/politique-confidentialite");
    revalidatePath("/politique-retour");

    return { status: "success", message: "Textes légaux enregistrés." };
  } catch {
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }
}
