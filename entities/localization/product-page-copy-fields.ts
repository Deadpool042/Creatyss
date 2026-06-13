import { PRODUCT_PAGE_COPY_FR } from "@/entities/languages/fr/product-page/product-page-copy_fr";

/**
 * Catalogue des champs traduisibles du dictionnaire fiche produit (Horizon 4
 * — généralisation `LocalizedValue`, pilote n°2 après `homepage`).
 *
 * cf. docs/lots/2026-06-13-localization-product-page-cadrage.md.
 *
 * Décrit le sujet `LocalizedValue` correspondant au dictionnaire
 * `PRODUCT_PAGE_COPY_FR` : `subjectType` / `subjectId` fixes, et un
 * `fieldName` en chemin pointé par champ traduisible (ex.
 * `"editorial.eyebrow"`). `jsonLdDefaultDescription` est hors catalogue
 * (texte technique SEO, non éditorial).
 */

export const PRODUCT_PAGE_COPY_SUBJECT_TYPE = "product_page_copy";
export const PRODUCT_PAGE_COPY_SUBJECT_ID = "product-page";

export type ProductPageCopyFieldDefinition = Readonly<{
  /** Chemin pointé dans `PRODUCT_PAGE_COPY_FR`, utilisé comme `LocalizedValue.fieldName`. */
  fieldName: string;
  /** Section du dictionnaire fiche produit (regroupement pour l'admin). */
  group: string;
  /** Libellé du champ pour l'admin de traduction. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

export const PRODUCT_PAGE_COPY_FIELDS: readonly ProductPageCopyFieldDefinition[] = [
  { fieldName: "editorial.eyebrow", group: "Éditorial", label: "Sur-titre" },
  { fieldName: "editorial.titleLine1", group: "Éditorial", label: "Titre (ligne 1)" },
  { fieldName: "editorial.titleLine2", group: "Éditorial", label: "Titre (ligne 2)" },
  { fieldName: "editorial.body", group: "Éditorial", label: "Texte", multiline: true },
  { fieldName: "editorial.ctaLabel", group: "Éditorial", label: "Libellé du bouton" },
  { fieldName: "editorial.ctaHref", group: "Éditorial", label: "Lien du bouton" },

  { fieldName: "heroBadges.location", group: "Badges hero", label: "Badge localisation" },
  { fieldName: "heroBadges.uniqueness", group: "Badges hero", label: "Badge unicité (portrait)" },
  {
    fieldName: "heroBadges.uniquenessCompact",
    group: "Badges hero",
    label: "Badge unicité (compact)",
  },
] as const;

/**
 * Lit la valeur de référence (locale par défaut, `fr`) pour un `fieldName`
 * en chemin pointé. Retourne `null` si le chemin est invalide ou si la
 * valeur résolue n'est pas une chaîne — ne devrait pas se produire pour un
 * `fieldName` issu de `PRODUCT_PAGE_COPY_FIELDS`.
 */
export function getProductPageCopyFrValue(fieldName: string): string | null {
  const segments = fieldName.split(".");
  let current: unknown = PRODUCT_PAGE_COPY_FR;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : null;
}

/** Forme du dictionnaire fiche produit (groupes de champs `fr`), indépendante de la locale. */
export type ProductPageCopyDictionary = typeof PRODUCT_PAGE_COPY_FR;

/**
 * Construit une copie de `base` où chaque `fieldName` (chemin pointé
 * `group.key`) présent dans `overrides` remplace la valeur du groupe
 * correspondant. Les clés d'`overrides` qui ne correspondent à aucun
 * groupe/champ connu de `base` sont ignorées. `overrides` vide → `base`
 * inchangé (même référence).
 *
 * `base` peut contenir des champs scalaires de premier niveau hors groupe
 * (ex. `jsonLdDefaultDescription`, non traduisible) : ils sont recopiés tels
 * quels, jamais ciblés par `overrides` (absents de `PRODUCT_PAGE_COPY_FIELDS`).
 */
export function withProductPageCopyOverrides(
  base: ProductPageCopyDictionary,
  overrides: Readonly<Record<string, string>>
): ProductPageCopyDictionary {
  const entries = Object.entries(overrides);

  if (entries.length === 0) {
    return base;
  }

  const result: Record<string, unknown> = {};

  for (const [group, value] of Object.entries(base)) {
    result[group] =
      typeof value === "object" && value !== null ? { ...(value as Record<string, unknown>) } : value;
  }

  for (const [fieldName, value] of entries) {
    const [group, key] = fieldName.split(".");

    if (group === undefined || key === undefined) {
      continue;
    }

    const groupFields = result[group];

    if (typeof groupFields !== "object" || groupFields === null || !(key in groupFields)) {
      continue;
    }

    (groupFields as Record<string, unknown>)[key] = value;
  }

  return result as ProductPageCopyDictionary;
}
