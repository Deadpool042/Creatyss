"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import {
  CONTACT_PAGE_COPY_FIELDS,
  CONTACT_PAGE_COPY_SUBJECT_ID,
  CONTACT_PAGE_COPY_SUBJECT_TYPE,
} from "@/entities/localization/contact-page-copy-fields";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsLocalizationLevel } from "@/features/localization/queries/get-localization-feature-state.query";

export type ContactPageTranslationsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function setContactPageTranslationsAction(
  _prevState: ContactPageTranslationsFormState,
  formData: FormData
): Promise<ContactPageTranslationsFormState> {
  const allowed = await meetsLocalizationLevel("multilingual");

  if (!allowed) {
    return {
      status: "error",
      message: "Fonctionnalité de localisation non activée.",
    };
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      status: "error",
      message: "Boutique introuvable.",
    };
  }

  const targetLocale = await db.localizationLocale.findFirst({
    where: {
      storeId,
      archivedAt: null,
      status: "ACTIVE",
      isDefault: false,
    },
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
    },
  });

  if (targetLocale === null) {
    return {
      status: "error",
      message: "Aucune langue secondaire active pour cette boutique.",
    };
  }

  try {
    await db.$transaction(
      CONTACT_PAGE_COPY_FIELDS.map((field) => {
        const rawValue = formData.get(field.fieldName);
        const valueText =
          typeof rawValue === "string" ? rawValue.trim() : "";

        return db.localizedValue.upsert({
          where: {
            subjectType_subjectId_fieldName_localeId: {
              subjectType: CONTACT_PAGE_COPY_SUBJECT_TYPE,
              subjectId: CONTACT_PAGE_COPY_SUBJECT_ID,
              fieldName: field.fieldName,
              localeId: targetLocale.id,
            },
          },
          create: {
            storeId,
            subjectType: CONTACT_PAGE_COPY_SUBJECT_TYPE,
            subjectId: CONTACT_PAGE_COPY_SUBJECT_ID,
            fieldName: field.fieldName,
            localeId: targetLocale.id,
            valueText,
            isFallback: false,
            status: valueText === "" ? "INACTIVE" : "ACTIVE",
          },
          update: {
            valueText,
            status: valueText === "" ? "INACTIVE" : "ACTIVE",
          },
        });
      })
    );
  } catch (error) {
    console.error("[contact-page-localization-translations]", error);

    return {
      status: "error",
      message: "Erreur lors de la sauvegarde. Réessayez.",
    };
  }

  revalidatePath("/admin/settings/localization/translations");

  return {
    status: "success",
    message: "Traductions de la page Contact enregistrées.",
  };
}
