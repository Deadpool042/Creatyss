/**
 * Catalogue des champs traduisibles d'un produit (Horizon 4 —
 * généralisation `LocalizedValue`, cf.
 * docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md).
 *
 * Sujet dynamique : `subjectId` = `Product.id` (même convention que
 * `blog-post-copy-fields.ts`). Les colonnes `name` / `shortDescription` /
 * `description` de `Product` restent la valeur de la locale par défaut ;
 * les traductions vivent dans `LocalizedValue`.
 */

export const PRODUCT_COPY_SUBJECT_TYPE = "product";

export type ProductCopyFieldDefinition = Readonly<{
  /** `LocalizedValue.fieldName` pour ce champ. */
  fieldName: "name" | "shortDescription" | "description";
  /** Libellé du champ pour l'admin de traduction. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

export const PRODUCT_COPY_FIELDS: readonly ProductCopyFieldDefinition[] = [
  { fieldName: "name", label: "Nom du produit" },
  { fieldName: "shortDescription", label: "Description courte", multiline: true },
  { fieldName: "description", label: "Description longue", multiline: true },
] as const;
