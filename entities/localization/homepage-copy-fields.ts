import { HOMEPAGE_COPY_FR } from "@/entities/languages/fr/homepage/homepage-copy_fr";

/**
 * Catalogue des champs traduisibles du dictionnaire homepage (Horizon 4 —
 * lot 4 sous-lot 4, « admin de traduction minimal pilote »).
 *
 * cf. docs/lots/2026-06-13-localization-l2-cadrage.md.
 *
 * Décrit le sujet `LocalizedValue` correspondant au dictionnaire
 * `HOMEPAGE_COPY_FR` (lot 3) : `subjectType` / `subjectId` fixes, et un
 * `fieldName` en chemin pointé par champ traduisible (ex.
 * `"hero.fallbackText"`). Ce catalogue est la référence commune pour
 * l'admin de traduction (sous-lot 4) et le câblage de lecture multilingue
 * du pilote homepage (sous-lot 5).
 */

export const HOMEPAGE_COPY_SUBJECT_TYPE = "homepage_copy";
export const HOMEPAGE_COPY_SUBJECT_ID = "homepage";

export type HomepageCopyFieldDefinition = Readonly<{
  /** Chemin pointé dans `HOMEPAGE_COPY_FR`, utilisé comme `LocalizedValue.fieldName`. */
  fieldName: string;
  /** Section du dictionnaire homepage (regroupement pour l'admin). */
  group: string;
  /** Libellé du champ pour l'admin de traduction. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

export const HOMEPAGE_COPY_FIELDS: readonly HomepageCopyFieldDefinition[] = [
  { fieldName: "hero.fallbackText", group: "Hero", label: "Texte de repli", multiline: true },

  {
    fieldName: "journal.fallbackInstagramUrl",
    group: "Journal",
    label: "URL Instagram (repli)",
  },
  {
    fieldName: "journal.fallbackFacebookUrl",
    group: "Journal",
    label: "URL Facebook (repli)",
  },
  { fieldName: "journal.emptyText", group: "Journal", label: "Texte d'état vide", multiline: true },

  {
    fieldName: "savoirFaire.imageAlt",
    group: "Savoir-faire",
    label: "Texte alternatif de l'image",
  },
  {
    fieldName: "savoirFaire.badgeNote",
    group: "Savoir-faire",
    label: "Note du badge",
    multiline: true,
  },

  { fieldName: "events.title", group: "Événements", label: "Titre de la section" },
  { fieldName: "events.intro", group: "Événements", label: "Texte d'introduction", multiline: true },
  {
    fieldName: "events.visitText",
    group: "Événements",
    label: "Texte d'invitation à la visite",
    multiline: true,
  },

  { fieldName: "editorial.fallbackTitle", group: "Éditorial", label: "Titre de repli" },
  {
    fieldName: "editorial.fallbackText",
    group: "Éditorial",
    label: "Texte de repli",
    multiline: true,
  },

  { fieldName: "collections.eyebrow", group: "Collections", label: "Sur-titre" },

  { fieldName: "about.fallbackTitle", group: "À propos", label: "Titre de repli" },
  {
    fieldName: "about.fallbackBody",
    group: "À propos",
    label: "Texte de repli",
    multiline: true,
  },
  { fieldName: "about.fallbackSubtitle", group: "À propos", label: "Sous-titre de repli" },
  { fieldName: "about.fallbackCtaLabel", group: "À propos", label: "Libellé du bouton" },
  { fieldName: "about.fallbackCtaHref", group: "À propos", label: "Lien du bouton" },
] as const;

/**
 * Lit la valeur de référence (locale par défaut, `fr`) pour un `fieldName`
 * en chemin pointé. Retourne `null` si le chemin est invalide ou si la
 * valeur résolue n'est pas une chaîne — ne devrait pas se produire pour un
 * `fieldName` issu de `HOMEPAGE_COPY_FIELDS`.
 */
export function getHomepageCopyFrValue(fieldName: string): string | null {
  const segments = fieldName.split(".");
  let current: unknown = HOMEPAGE_COPY_FR;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : null;
}

/** Forme du dictionnaire homepage (groupes de champs `fr`), indépendante de la locale. */
export type HomepageCopyDictionary = typeof HOMEPAGE_COPY_FR;

/**
 * Lot 4 sous-lot 5 — câblage lecture multilingue du pilote homepage (cf.
 * docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Construit une copie de `base` où chaque `fieldName` (chemin pointé
 * `group.key`) présent dans `overrides` remplace la valeur du groupe
 * correspondant. Les clés d'`overrides` qui ne correspondent à aucun
 * groupe/champ connu de `base` sont ignorées. `overrides` vide → `base`
 * inchangé (même référence).
 */
export function withHomepageCopyOverrides(
  base: HomepageCopyDictionary,
  overrides: Readonly<Record<string, string>>
): HomepageCopyDictionary {
  const entries = Object.entries(overrides);

  if (entries.length === 0) {
    return base;
  }

  const result: Record<string, Record<string, unknown>> = {};

  for (const [group, fields] of Object.entries(base)) {
    result[group] = { ...(fields as Record<string, unknown>) };
  }

  for (const [fieldName, value] of entries) {
    const [group, key] = fieldName.split(".");

    if (group === undefined || key === undefined) {
      continue;
    }

    const groupFields = result[group];

    if (groupFields === undefined || !(key in groupFields)) {
      continue;
    }

    groupFields[key] = value;
  }

  return result as HomepageCopyDictionary;
}
