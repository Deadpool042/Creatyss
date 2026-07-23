"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import {
  PRODUCT_SEO_COPY_FIELDS,
  PRODUCT_SEO_COPY_SUBJECT_TYPE,
} from "@/entities/localization/product-seo-copy-fields";
import { buildAdminProductSeoPath } from "@/features/admin/products/navigation";

export type ProductSeoTranslationsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Généralisation `LocalizedValue` — sujet dynamique `product-seo`
 * (`subjectId` = `Product.id`), inspiré de `setProductTranslationsAction`.
 *
 * Enregistre les traductions des champs texte `SeoMetadata`
 * (`PRODUCT_SEO_COPY_FIELDS`) pour la locale secondaire `ACTIVE` du store :
 * un `LocalizedValue` par champ, `ACTIVE` si une valeur non vide est
 * fournie, `INACTIVE` sinon (la valeur est conservée mais non exposée —
 * cf. invariant de `resolveLocalizedValue`).
 *
 * Refuse l'écriture si le produit n'appartient pas à la boutique courante.
 */
export async function setProductSeoTranslationsAction(
  _prevState: ProductSeoTranslationsFormState,
  formData: FormData
): Promise<ProductSeoTranslationsFormState> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return { status: "error", message: "Fonctionnalité de localisation non activée." };
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { status: "error", message: "Boutique introuvable." };
  }

  const rawProductId = formData.get("productId");
  const productId = typeof rawProductId === "string" ? rawProductId : "";

  if (productId === "") {
    return { status: "error", message: "Produit introuvable." };
  }

  const product = await db.product.findFirst({
    where: { id: productId, storeId, archivedAt: null },
    select: { id: true, slug: true },
  });

  if (product === null) {
    return { status: "error", message: "Produit introuvable." };
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
      PRODUCT_SEO_COPY_FIELDS.map((field) => {
        const raw = formData.get(field.fieldName);
        const valueText = typeof raw === "string" ? raw.trim() : "";

        return db.localizedValue.upsert({
          where: {
            subjectType_subjectId_fieldName_localeId: {
              subjectType: PRODUCT_SEO_COPY_SUBJECT_TYPE,
              subjectId: product.id,
              fieldName: field.fieldName,
              localeId: targetLocale.id,
            },
          },
          create: {
            storeId,
            subjectType: PRODUCT_SEO_COPY_SUBJECT_TYPE,
            subjectId: product.id,
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
    console.error("[product-seo-translations]", error);
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }

  revalidatePath(buildAdminProductSeoPath(product.slug));

  return { status: "success", message: "Traductions SEO enregistrées." };
}
