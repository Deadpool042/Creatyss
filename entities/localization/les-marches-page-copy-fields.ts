import { CONTENT_PAGES_COPY_FR } from "@/entities/languages/fr/content-pages/content-pages-copy_fr";

/**
 * Catalogue des champs traduisibles du dictionnaire page Les marchés
 * (généralisation `LocalizedValue`, même pattern que homepage / product-page /
 * boutique-page).
 *
 * Subject `LocalizedValue` : `subjectType = "content_page_copy"`,
 * `subjectId = "les-marches"`.
 *
 * `ctaPrimary.href` et `ctaSecondary.href` sont hors catalogue (URLs
 * techniques, non éditoriaux).
 */

export const LES_MARCHES_PAGE_COPY_SUBJECT_TYPE = "content_page_copy";
export const LES_MARCHES_PAGE_COPY_SUBJECT_ID = "les-marches";

export type LesMarchesPageCopyFieldDefinition = Readonly<{
  fieldName: string;
  group: string;
  label: string;
  multiline?: boolean;
}>;

export const LES_MARCHES_PAGE_COPY_FIELDS: readonly LesMarchesPageCopyFieldDefinition[] = [
  { fieldName: "metadata.title", group: "Référencement", label: "Titre SEO" },
  {
    fieldName: "metadata.description",
    group: "Référencement",
    label: "Description SEO",
    multiline: true,
  },
  { fieldName: "eyebrow", group: "Éditorial", label: "Sur-titre" },
  { fieldName: "title", group: "Éditorial", label: "Titre principal" },
  { fieldName: "intro", group: "Éditorial", label: "Texte d'introduction", multiline: true },
  { fieldName: "placeholder.title", group: "Calendrier", label: "Titre du placeholder" },
  {
    fieldName: "placeholder.body",
    group: "Calendrier",
    label: "Corps du placeholder",
    multiline: true,
  },
  { fieldName: "placeholder.note", group: "Calendrier", label: "Note du placeholder" },
  { fieldName: "atelier.title", group: "Atelier", label: "Titre de l'atelier" },
  { fieldName: "atelier.subtitle", group: "Atelier", label: "Sous-titre de l'atelier" },
  { fieldName: "ctaPrimary.label", group: "CTA", label: "Bouton principal — libellé" },
  { fieldName: "ctaSecondary.label", group: "CTA", label: "Bouton secondaire — libellé" },
] as const;

/** Forme du dictionnaire page Les marchés, indépendante de la locale. */
export type LesMarchesPageCopyDictionary = typeof CONTENT_PAGES_COPY_FR.lesMarches;

/**
 * Lit la valeur de référence (locale par défaut, `fr`) pour un `fieldName`
 * en chemin pointé. Retourne `null` si le chemin est invalide ou si la valeur
 * résolue n'est pas une chaîne.
 */
export function getLesMarchesPageCopyFrValue(fieldName: string): string | null {
  const segments = fieldName.split(".");
  let current: unknown = CONTENT_PAGES_COPY_FR.lesMarches;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || !(segment in (current as object))) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : null;
}

/**
 * Construit une copie de `base` où chaque `fieldName` présent dans `overrides`
 * remplace la valeur correspondante. Supporte :
 * - les scalaires de premier niveau (`eyebrow`, `title`, `intro`) ;
 * - les chemins à 2 niveaux (`metadata.title`, `placeholder.body`, etc.).
 *
 * `overrides` vide → `base` inchangé (même référence).
 * Les champs absents de `base` ou non conformes sont ignorés sans erreur.
 */
export function withLesMarchesPageCopyOverrides(
  base: LesMarchesPageCopyDictionary,
  overrides: Readonly<Record<string, string>>
): LesMarchesPageCopyDictionary {
  const entries = Object.entries(overrides);

  if (entries.length === 0) {
    return base;
  }

  // Clone superficiel du premier niveau
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(base)) {
    result[key] =
      typeof value === "object" && value !== null
        ? { ...(value as Record<string, unknown>) }
        : value;
  }

  for (const [fieldName, value] of entries) {
    const dotIndex = fieldName.indexOf(".");

    if (dotIndex === -1) {
      // Scalaire de premier niveau (eyebrow, title, intro)
      if (fieldName in result && typeof result[fieldName] === "string") {
        result[fieldName] = value;
      }
    } else {
      // Chemin à 2 niveaux (group.key)
      const group = fieldName.slice(0, dotIndex);
      const key = fieldName.slice(dotIndex + 1);
      const groupFields = result[group];

      if (
        typeof groupFields === "object" &&
        groupFields !== null &&
        key in (groupFields as object)
      ) {
        (groupFields as Record<string, unknown>)[key] = value;
      }
    }
  }

  return result as LesMarchesPageCopyDictionary;
}
