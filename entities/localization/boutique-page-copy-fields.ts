import { BOUTIQUE_PAGE_COPY_FR } from "@/entities/languages/fr/boutique-page/boutique-page-copy_fr";

/**
 * Catalogue des champs traduisibles du dictionnaire page boutique (Horizon 4
 * — généralisation `LocalizedValue`, pilote n°3 après `homepage` et
 * `product-page`).
 *
 * cf. docs/lots/2026-06-13-localization-boutique-page-cadrage.md.
 *
 * Décrit le sujet `LocalizedValue` correspondant au dictionnaire
 * `BOUTIQUE_PAGE_COPY_FR` : `subjectType` / `subjectId` fixes, et un
 * `fieldName` en chemin pointé par champ traduisible (ex.
 * `"marketAside.uniqueBlock.title"`). `marketAside.events` est hors
 * catalogue (tableau placeholder, à remplacer par une source CMS — décision
 * tracée dans le cadrage).
 */

export const BOUTIQUE_PAGE_COPY_SUBJECT_TYPE = "boutique_page_copy";
export const BOUTIQUE_PAGE_COPY_SUBJECT_ID = "boutique-page";

export type BoutiquePageCopyFieldDefinition = Readonly<{
  /** Chemin pointé dans `BOUTIQUE_PAGE_COPY_FR`, utilisé comme `LocalizedValue.fieldName`. */
  fieldName: string;
  /** Section du dictionnaire page boutique (regroupement pour l'admin). */
  group: string;
  /** Libellé du champ pour l'admin de traduction. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

export const BOUTIQUE_PAGE_COPY_FIELDS: readonly BoutiquePageCopyFieldDefinition[] = [
  { fieldName: "header.defaultEyebrow", group: "En-tête", label: "Sur-titre (sans catégorie)" },
  {
    fieldName: "header.categoryEyebrowPrefix",
    group: "En-tête",
    label: "Préfixe sur-titre (catégorie active)",
  },
  { fieldName: "header.intro", group: "En-tête", label: "Texte d'introduction", multiline: true },

  { fieldName: "engagements.ariaLabel", group: "Engagements", label: "Libellé ARIA (section)" },

  { fieldName: "marketAside.ariaLabel", group: "Aside marchés", label: "Libellé ARIA (aside)" },
  { fieldName: "marketAside.label", group: "Aside marchés", label: "Eyebrow" },
  { fieldName: "marketAside.title", group: "Aside marchés", label: "Titre" },
  { fieldName: "marketAside.ctaLabel", group: "Aside marchés", label: "Libellé du lien" },
  {
    fieldName: "marketAside.uniqueBlock.title",
    group: "Aside marchés",
    label: "Bloc pièce unique — titre",
  },
  {
    fieldName: "marketAside.uniqueBlock.body",
    group: "Aside marchés",
    label: "Bloc pièce unique — texte",
    multiline: true,
  },
] as const;

/**
 * Lit la valeur de référence (locale par défaut, `fr`) pour un `fieldName`
 * en chemin pointé. Retourne `null` si le chemin est invalide ou si la
 * valeur résolue n'est pas une chaîne — ne devrait pas se produire pour un
 * `fieldName` issu de `BOUTIQUE_PAGE_COPY_FIELDS`.
 */
export function getBoutiquePageCopyFrValue(fieldName: string): string | null {
  const segments = fieldName.split(".");
  let current: unknown = BOUTIQUE_PAGE_COPY_FR;

  for (const segment of segments) {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return typeof current === "string" ? current : null;
}

/** Forme du dictionnaire page boutique (groupes de champs `fr`), indépendante de la locale. */
export type BoutiquePageCopyDictionary = typeof BOUTIQUE_PAGE_COPY_FR;

/**
 * Construit une copie de `base` où chaque `fieldName` (chemin pointé,
 * profondeur ≥ 2, ex. `"header.intro"` ou `"marketAside.uniqueBlock.title"`)
 * présent dans `overrides` remplace la valeur correspondante. Les clés
 * d'`overrides` qui ne correspondent à aucun chemin connu de `base` sont
 * ignorées. `overrides` vide → `base` inchangé (même référence).
 *
 * Chaque niveau traversé est cloné superficiellement avant mutation : `base`
 * (et ses objets imbriqués, notamment `marketAside.events`, hors catalogue)
 * ne sont jamais modifiés.
 */
export function withBoutiquePageCopyOverrides(
  base: BoutiquePageCopyDictionary,
  overrides: Readonly<Record<string, string>>
): BoutiquePageCopyDictionary {
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
    const segments = fieldName.split(".");
    const leafKey = segments.pop();

    if (leafKey === undefined || segments.length === 0) {
      continue;
    }

    let cursor: Record<string, unknown> = result;
    let valid = true;

    for (const segment of segments) {
      const current = cursor[segment];

      // Les tableaux (ex. `marketAside.events`, hors catalogue) ne sont
      // jamais traversés : bail-out avant toute réassignation pour ne pas
      // les transformer en objet indexé.
      if (typeof current !== "object" || current === null || Array.isArray(current)) {
        valid = false;
        break;
      }

      // `result[<groupe racine>]` est déjà un clone superficiel frais (cf.
      // boucle ci-dessus) ; les niveaux plus profonds sont encore partagés
      // avec `base` et doivent être clonés avant mutation.
      const clone =
        cursor === result
          ? (current as Record<string, unknown>)
          : { ...(current as Record<string, unknown>) };
      cursor[segment] = clone;
      cursor = clone;
    }

    if (!valid || !(leafKey in cursor)) {
      continue;
    }

    cursor[leafKey] = value;
  }

  return result as BoutiquePageCopyDictionary;
}
