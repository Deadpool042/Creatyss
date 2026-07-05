import "server-only";

import { db } from "@/core/db";
import {
  BLOG_POST_COPY_FIELDS,
  BLOG_POST_COPY_SUBJECT_TYPE,
} from "@/entities/localization/blog-post-copy-fields";

/**
 * Généralisation `LocalizedValue` — sujet dynamique blog (`subjectId` =
 * `BlogPost.id`), cf. entities/localization/blog-post-copy-fields.ts.
 *
 * Construit l'état de la section traductions du formulaire d'édition d'un
 * article : pour chaque champ traduisible, la valeur de référence (colonnes
 * `BlogPost`, locale par défaut) et la `LocalizedValue` existante pour la
 * locale secondaire ACTIVE du store, si elle existe.
 *
 * Si le store n'a pas de seconde locale `ACTIVE`, retourne
 * `{ hasTargetLocale: false }` — l'appelant masque la section.
 */

export type BlogPostTranslationFieldState = {
  fieldName: string;
  label: string;
  multiline: boolean;
  /** Valeur de référence (locale par défaut) — lecture seule dans l'admin. */
  sourceValue: string;
  /** Valeur traduite existante pour la locale cible, ou `null` si absente. */
  translatedValue: string | null;
};

export type BlogPostTranslationsState =
  | { hasTargetLocale: false }
  | {
      hasTargetLocale: true;
      targetLocaleName: string;
      fields: BlogPostTranslationFieldState[];
    };

const NO_TARGET_LOCALE_STATE: BlogPostTranslationsState = { hasTargetLocale: false };

export async function listBlogPostTranslations(input: {
  postId: string;
}): Promise<BlogPostTranslationsState> {
  const post = await db.blogPost.findFirst({
    where: { id: input.postId, archivedAt: null },
    select: { id: true, storeId: true, title: true, excerpt: true, body: true },
  });

  if (post === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const targetLocale = await db.localizationLocale.findFirst({
    where: { storeId: post.storeId, archivedAt: null, status: "ACTIVE", isDefault: false },
    orderBy: { code: "asc" },
    select: { id: true, name: true },
  });

  if (targetLocale === null) {
    return NO_TARGET_LOCALE_STATE;
  }

  const existingValues = await db.localizedValue.findMany({
    where: {
      storeId: post.storeId,
      subjectType: BLOG_POST_COPY_SUBJECT_TYPE,
      subjectId: post.id,
      localeId: targetLocale.id,
      archivedAt: null,
    },
    select: { fieldName: true, valueText: true },
  });

  const valuesByField = new Map(existingValues.map((value) => [value.fieldName, value.valueText]));

  const sourceByField: Record<string, string> = {
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.body ?? "",
  };

  const fields: BlogPostTranslationFieldState[] = BLOG_POST_COPY_FIELDS.map((field) => ({
    fieldName: field.fieldName,
    label: field.label,
    multiline: field.multiline ?? false,
    sourceValue: sourceByField[field.fieldName] ?? "",
    translatedValue: valuesByField.get(field.fieldName) ?? null,
  }));

  return {
    hasTargetLocale: true,
    targetLocaleName: targetLocale.name,
    fields,
  };
}
