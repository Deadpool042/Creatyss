"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import {
  PRODUCT_PAGE_COPY_FIELDS,
  PRODUCT_PAGE_COPY_SUBJECT_ID,
  PRODUCT_PAGE_COPY_SUBJECT_TYPE,
} from "@/entities/localization/product-page-copy-fields";

export type ProductPageTranslationsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Généralisation `LocalizedValue`, pilote n°2 (fiche produit), cf.
 * docs/lots/2026-06-13-localization-product-page-cadrage.md.
 *
 * Enregistre les traductions du dictionnaire fiche produit
 * (`PRODUCT_PAGE_COPY_FIELDS`) pour la locale secondaire `ACTIVE` du store :
 * un `LocalizedValue` par champ (clé `subjectType`/`subjectId`/`fieldName`/`localeId`),
 * `ACTIVE` si une valeur non vide est fournie, `INACTIVE` sinon (la valeur
 * est conservée mais non exposée — cf. invariant de `resolveLocalizedValue`).
 */
export async function setProductPageTranslationsAction(
  _prevState: ProductPageTranslationsFormState,
  formData: FormData
): Promise<ProductPageTranslationsFormState> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return { status: "error", message: "Fonctionnalité de localisation non activée." };
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { status: "error", message: "Boutique introuvable." };
  }

  const targetLocale = await db.localizationLocale.findFirst({
    where: { storeId, archivedAt: null, status: "ACTIVE", isDefault: false },
    orderBy: { code: "asc" },
    select: { id: true },
  });

  if (targetLocale === null) {
    return { status: "error", message: "Aucune langue secondaire active pour cette boutique." };
  }

  try {
    await db.$transaction(
      PRODUCT_PAGE_COPY_FIELDS.map((field) => {
        const raw = formData.get(field.fieldName);
        const valueText = typeof raw === "string" ? raw.trim() : "";

        return db.localizedValue.upsert({
          where: {
            subjectType_subjectId_fieldName_localeId: {
              subjectType: PRODUCT_PAGE_COPY_SUBJECT_TYPE,
              subjectId: PRODUCT_PAGE_COPY_SUBJECT_ID,
              fieldName: field.fieldName,
              localeId: targetLocale.id,
            },
          },
          create: {
            storeId,
            subjectType: PRODUCT_PAGE_COPY_SUBJECT_TYPE,
            subjectId: PRODUCT_PAGE_COPY_SUBJECT_ID,
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
    console.error("[localization-translations]", error);
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }

  revalidatePath("/admin/settings/localization/translations");

  return { status: "success", message: "Traductions enregistrées." };
}
