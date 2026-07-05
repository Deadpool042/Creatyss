/**
 * Catalogue des champs traduisibles d'un article de blog (Horizon 4 —
 * généralisation `LocalizedValue`, cf.
 * docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md).
 *
 * Contrairement aux dictionnaires de pages (`product_page_copy`, etc.) où le
 * `subjectId` est fixe, le sujet est ici dynamique : `subjectId` =
 * `BlogPost.id`. Les colonnes `title` / `excerpt` / `body` de `BlogPost`
 * restent la valeur de la locale par défaut ; les traductions vivent dans
 * `LocalizedValue`.
 */

export const BLOG_POST_COPY_SUBJECT_TYPE = "blog_post";

export type BlogPostCopyFieldDefinition = Readonly<{
  /** `LocalizedValue.fieldName` pour ce champ. */
  fieldName: "title" | "excerpt" | "content";
  /** Libellé du champ pour l'admin de traduction. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

export const BLOG_POST_COPY_FIELDS: readonly BlogPostCopyFieldDefinition[] = [
  { fieldName: "title", label: "Titre" },
  { fieldName: "excerpt", label: "Extrait", multiline: true },
  { fieldName: "content", label: "Contenu", multiline: true },
] as const;
