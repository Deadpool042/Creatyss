/**
 * Catalogue des champs traduisibles d'une catégorie (Horizon 4 —
 * généralisation `LocalizedValue`, cf.
 * docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md).
 *
 * Sujet dynamique : `subjectId` = `Category.id` (même convention que
 * `product-copy-fields.ts`). Les colonnes `name` / `shortDescription` /
 * `description` de `Category` restent la valeur de la locale par défaut ;
 * les traductions vivent dans `LocalizedValue`.
 */

export const CATEGORY_COPY_SUBJECT_TYPE = "category";

export type CategoryCopyFieldDefinition = Readonly<{
  /** `LocalizedValue.fieldName` pour ce champ. */
  fieldName: "name" | "shortDescription" | "description";
  /** Libellé du champ pour l'admin de traduction. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

export const CATEGORY_COPY_FIELDS: readonly CategoryCopyFieldDefinition[] = [
  { fieldName: "name", label: "Nom de la catégorie" },
  { fieldName: "shortDescription", label: "Description courte", multiline: true },
  { fieldName: "description", label: "Description longue", multiline: true },
] as const;
