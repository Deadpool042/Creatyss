import { CONTENT_PAGES_COPY_FR } from "@/entities/languages/fr/content-pages/content-pages-copy_fr";

/**
 * Catalogue des champs traduisibles du dictionnaire page À propos
 * (généralisation `LocalizedValue`, même pattern que homepage / product-page /
 * boutique-page).
 *
 * Subject `LocalizedValue` : `subjectType = "content_page_copy"`,
 * `subjectId = "a-propos"`.
 *
 * `ctaPrimary.href` et `ctaSecondary.href` sont hors catalogue (URLs
 * techniques, non éditoriaux).
 */

export const A_PROPOS_PAGE_COPY_SUBJECT_TYPE = "content_page_copy";
export const A_PROPOS_PAGE_COPY_SUBJECT_ID = "a-propos";

export type AProposPageCopyFieldDefinition = Readonly<{
  fieldName: string;
  group: string;
  label: string;
  multiline?: boolean;
}>;

export const A_PROPOS_PAGE_COPY_FIELDS: readonly AProposPageCopyFieldDefinition[] = [
  { fieldName: "metadata.title", group: "Référencement", label: "Titre SEO" },
  {
    fieldName: "metadata.description",
    group: "Référencement",
    label: "Description SEO",
    multiline: true,
  },
  { fieldName: "eyebrow", group: "Éditorial", label: "Sur-titre" },
  { fieldName: "title", group: "Éditorial", label: "Titre principal" },
  { fieldName: "ctaPrimary.label", group: "CTA", label: "Bouton principal — libellé" },
  { fieldName: "ctaSecondary.label", group: "CTA", label: "Bouton secondaire — libellé" },
  { fieldName: "sections.0.title", group: "Sections", label: "Section 1 — titre" },
  {
    fieldName: "sections.0.body",
    group: "Sections",
    label: "Section 1 — texte",
    multiline: true,
  },
  { fieldName: "sections.1.title", group: "Sections", label: "Section 2 — titre" },
  {
    fieldName: "sections.1.body",
    group: "Sections",
    label: "Section 2 — texte",
    multiline: true,
  },
  { fieldName: "sections.2.title", group: "Sections", label: "Section 3 — titre" },
  {
    fieldName: "sections.2.body",
    group: "Sections",
    label: "Section 3 — texte",
    multiline: true,
  },
] as const;

/** Forme du dictionnaire page À propos, indépendante de la locale. */
export type AProposPageCopyDictionary = typeof CONTENT_PAGES_COPY_FR.aPropos;

/**
 * Lit la valeur de référence (locale par défaut, `fr`) pour un `fieldName`
 * en chemin pointé. Retourne `null` si le chemin est invalide ou si la valeur
 * résolue n'est pas une chaîne. Supporte les segments numériques pour accéder
 * aux éléments de `sections` (`sections.0.title`).
 */
export function getAProposPageCopyFrValue(fieldName: string): string | null {
  const segments = fieldName.split(".");
  let current: unknown = CONTENT_PAGES_COPY_FR.aPropos;

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
 * - les scalaires de premier niveau (`eyebrow`, `title`) ;
 * - les chemins à 2 niveaux (`metadata.title`, `ctaPrimary.label`) ;
 * - les chemins à 3 niveaux avec index de tableau (`sections.0.title`).
 *
 * `overrides` vide → `base` inchangé (même référence).
 * Les champs absents de `base` ou non conformes sont ignorés sans erreur.
 */
export function withAProposPageCopyOverrides(
  base: AProposPageCopyDictionary,
  overrides: Readonly<Record<string, string>>
): AProposPageCopyDictionary {
  const entries = Object.entries(overrides);

  if (entries.length === 0) {
    return base;
  }

  // Clone superficiel du premier niveau. Les tableaux sont clonés avec leurs
  // éléments objets eux-mêmes clonés superficiellement, pour que les mutations
  // de feuille restent sûres sans clonage supplémentaire lors de la traversée.
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(base)) {
    if (Array.isArray(value)) {
      result[key] = (value as ReadonlyArray<unknown>).map((item) =>
        typeof item === "object" && item !== null ? { ...(item as Record<string, unknown>) } : item
      );
    } else if (typeof value === "object" && value !== null) {
      result[key] = { ...(value as Record<string, unknown>) };
    } else {
      result[key] = value;
    }
  }

  for (const [fieldName, value] of entries) {
    const segments = fieldName.split(".");

    if (segments.length === 0) {
      continue;
    }

    if (segments.length === 1) {
      // Scalaire de premier niveau (eyebrow, title)
      const key = segments[0]!;

      if (key in result && typeof result[key] === "string") {
        result[key] = value;
      }

      continue;
    }

    // Chemin multi-niveaux : traverser jusqu'à l'avant-dernier segment
    const leafKey = segments[segments.length - 1]!;
    const pathSegments = segments.slice(0, -1);
    let cursor: unknown = result;
    let valid = true;

    for (const segment of pathSegments) {
      if (Array.isArray(cursor)) {
        const index = parseInt(segment, 10);

        if (isNaN(index) || index < 0 || index >= (cursor as unknown[]).length) {
          valid = false;
          break;
        }

        cursor = (cursor as unknown[])[index];
      } else if (typeof cursor === "object" && cursor !== null) {
        cursor = (cursor as Record<string, unknown>)[segment];
      } else {
        valid = false;
        break;
      }

      if (cursor === undefined || cursor === null) {
        valid = false;
        break;
      }
    }

    if (!valid || typeof cursor !== "object" || cursor === null || Array.isArray(cursor)) {
      continue;
    }

    const obj = cursor as Record<string, unknown>;

    if (leafKey in obj) {
      obj[leafKey] = value;
    }
  }

  return result as AProposPageCopyDictionary;
}
