"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import {
  LES_MARCHES_PAGE_COPY_FIELDS,
  LES_MARCHES_PAGE_COPY_SUBJECT_ID,
  LES_MARCHES_PAGE_COPY_SUBJECT_TYPE,
} from "@/entities/localization/les-marches-page-copy-fields";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";

export type LesMarchesPageTranslationsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function setLesMarchesPageTranslationsAction(
  _prevState: LesMarchesPageTranslationsFormState,
  formData: FormData
): Promise<LesMarchesPageTranslationsFormState> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

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
      LES_MARCHES_PAGE_COPY_FIELDS.map((field) => {
        const rawValue = formData.get(field.fieldName);
        const valueText = typeof rawValue === "string" ? rawValue.trim() : "";

        return db.localizedValue.upsert({
          where: {
            subjectType_subjectId_fieldName_localeId: {
              subjectType: LES_MARCHES_PAGE_COPY_SUBJECT_TYPE,
              subjectId: LES_MARCHES_PAGE_COPY_SUBJECT_ID,
              fieldName: field.fieldName,
              localeId: targetLocale.id,
            },
          },
          create: {
            storeId,
            subjectType: LES_MARCHES_PAGE_COPY_SUBJECT_TYPE,
            subjectId: LES_MARCHES_PAGE_COPY_SUBJECT_ID,
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
    console.error("[les-marches-page-localization-translations]", error);

    return {
      status: "error",
      message: "Erreur lors de la sauvegarde. Réessayez.",
    };
  }

  revalidatePath("/admin/settings/localization/translations");
  revalidatePath("/admin/settings/advanced/optional/localization/translations");
  revalidatePath("/les-marches");

  return {
    status: "success",
    message: "Traductions de la page Les marchés enregistrées.",
  };
}
