"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { LOCALIZATION_FEATURE_CODE } from "@/features/localization/queries/get-localization-feature-state.query";
import {
  BLOG_POST_COPY_FIELDS,
  BLOG_POST_COPY_SUBJECT_TYPE,
} from "@/entities/localization/blog-post-copy-fields";

export type BlogPostTranslationsFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

/**
 * Généralisation `LocalizedValue` — sujet dynamique blog (`subjectId` =
 * `BlogPost.id`), inspiré de `setProductPageTranslationsAction`.
 *
 * Enregistre les traductions d'un article (`BLOG_POST_COPY_FIELDS`) pour la
 * locale secondaire `ACTIVE` du store : un `LocalizedValue` par champ,
 * `ACTIVE` si une valeur non vide est fournie, `INACTIVE` sinon (la valeur
 * est conservée mais non exposée — cf. invariant de `resolveLocalizedValue`).
 */
export async function setBlogPostTranslationsAction(
  _prevState: BlogPostTranslationsFormState,
  formData: FormData
): Promise<BlogPostTranslationsFormState> {
  const allowed = await meetsFeatureLevel(LOCALIZATION_FEATURE_CODE, "multilingual");

  if (!allowed) {
    return { status: "error", message: "Fonctionnalité de localisation non activée." };
  }

  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return { status: "error", message: "Boutique introuvable." };
  }

  const rawPostId = formData.get("postId");
  const postId = typeof rawPostId === "string" ? rawPostId : "";

  if (postId === "") {
    return { status: "error", message: "Article introuvable." };
  }

  const post = await db.blogPost.findFirst({
    where: { id: postId, storeId, archivedAt: null },
    select: { id: true },
  });

  if (post === null) {
    return { status: "error", message: "Article introuvable." };
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
      BLOG_POST_COPY_FIELDS.map((field) => {
        const raw = formData.get(field.fieldName);
        const valueText = typeof raw === "string" ? raw.trim() : "";

        return db.localizedValue.upsert({
          where: {
            subjectType_subjectId_fieldName_localeId: {
              subjectType: BLOG_POST_COPY_SUBJECT_TYPE,
              subjectId: post.id,
              fieldName: field.fieldName,
              localeId: targetLocale.id,
            },
          },
          create: {
            storeId,
            subjectType: BLOG_POST_COPY_SUBJECT_TYPE,
            subjectId: post.id,
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
    console.error("[blog-post-translations]", error);
    return { status: "error", message: "Erreur lors de la sauvegarde. Réessayez." };
  }

  revalidatePath(`/admin/content/blog/${post.id}`);

  return { status: "success", message: "Traductions enregistrées." };
}
