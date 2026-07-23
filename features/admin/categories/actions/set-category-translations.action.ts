"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import {
  CATEGORY_COPY_FIELDS,
  CATEGORY_COPY_SUBJECT_TYPE,
} from "@/entities/localization/category-copy-fields";
import { getAdminCategoryDetailPath } from "@/features/admin/categories/shared/admin-categories-routes";

export type CategoryTranslationsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Généralisation `LocalizedValue` — sujet dynamique catégorie (`subjectId` =
 * `Category.id`), inspiré de `setProductTranslationsAction`.
 *
 * Enregistre les traductions d'une catégorie (`CATEGORY_COPY_FIELDS`) pour la
 * locale secondaire `ACTIVE` du store : un `LocalizedValue` par champ,
 * `ACTIVE` si une valeur non vide est fournie, `INACTIVE` sinon (la valeur
 * est conservée mais non exposée — cf. invariant de `resolveLocalizedValue`).
 *
 * Refuse l'écriture si la catégorie n'appartient pas à la boutique courante.
 */
export async function setCategoryTranslationsAction(
  _prevState: CategoryTranslationsFormState,
  formData: FormData
): Promise<CategoryTranslationsFormState> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return { status: "error", message: "Fonctionnalité de localisation non activée." };
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { status: "error", message: "Boutique introuvable." };
  }

  const rawCategoryId = formData.get("categoryId");
  const categoryId = typeof rawCategoryId === "string" ? rawCategoryId : "";

  if (categoryId === "") {
    return { status: "error", message: "Catégorie introuvable." };
  }

  const category = await db.category.findFirst({
    where: { id: categoryId, storeId, archivedAt: null },
    select: { id: true, slug: true },
  });

  if (category === null) {
    return { status: "error", message: "Catégorie introuvable." };
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
      CATEGORY_COPY_FIELDS.map((field) => {
        const raw = formData.get(field.fieldName);
        const valueText = typeof raw === "string" ? raw.trim() : "";

        return db.localizedValue.upsert({
          where: {
            subjectType_subjectId_fieldName_localeId: {
              subjectType: CATEGORY_COPY_SUBJECT_TYPE,
              subjectId: category.id,
              fieldName: field.fieldName,
              localeId: targetLocale.id,
            },
          },
          create: {
            storeId,
            subjectType: CATEGORY_COPY_SUBJECT_TYPE,
            subjectId: category.id,
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
    console.error("[category-translations]", error);
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }

  revalidatePath(getAdminCategoryDetailPath(category.slug));

  return { status: "success", message: "Traductions enregistrées." };
}
