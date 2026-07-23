/**
 * Catalogue des champs SEO traduisibles d'un produit (Horizon 4 —
 * généralisation `LocalizedValue`, cf.
 * docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md).
 *
 * Sujet dynamique distinct de `product-copy-fields.ts` : `subjectId` =
 * `Product.id` (même convention que `SeoMetadata.subjectId` pour un produit,
 * cf. `features/storefront/catalog/queries/get-published-product-by-slug/readers.ts`),
 * mais la valeur canonique de chaque champ vit dans `SeoMetadata`, pas dans
 * les colonnes `Product`.
 */

export const PRODUCT_SEO_COPY_SUBJECT_TYPE = "product-seo";

export type ProductSeoCopyFieldDefinition = Readonly<{
  /** `LocalizedValue.fieldName` pour ce champ. */
  fieldName:
    | "metaTitle"
    | "metaDescription"
    | "openGraphTitle"
    | "openGraphDescription"
    | "twitterTitle"
    | "twitterDescription";
  /** Libellé du champ pour l'admin de traduction. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

export const PRODUCT_SEO_COPY_FIELDS: readonly ProductSeoCopyFieldDefinition[] = [
  { fieldName: "metaTitle", label: "Titre SEO" },
  { fieldName: "metaDescription", label: "Description SEO", multiline: true },
  { fieldName: "openGraphTitle", label: "Titre Open Graph" },
  { fieldName: "openGraphDescription", label: "Description Open Graph", multiline: true },
  { fieldName: "twitterTitle", label: "Titre X (Twitter)" },
  { fieldName: "twitterDescription", label: "Description X (Twitter)", multiline: true },
] as const;
