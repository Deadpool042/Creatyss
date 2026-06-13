/**
 * Résolution pure d'une valeur localisée, avec fallback vers la locale par
 * défaut (Horizon 4 — lot 4 sous-lot 2, « L2 multilingual »).
 *
 * cf. docs/lots/2026-06-13-localization-l2-cadrage.md et
 * docs/domains/cross-cutting/localization.md.
 *
 * Une `LocalizedValue` n'est retenue que si son statut est `ACTIVE` : une
 * valeur `DRAFT`, `INACTIVE` ou `ARCHIVED` n'est jamais exposée — invariant
 * du domaine (« une valeur localisée inapplicable, inactive ou non publiée
 * ne doit pas être exposée hors règle explicite »).
 *
 * Règle de résolution :
 * - une valeur ACTIVE existe pour la locale demandée → retenue, sans
 *   fallback ;
 * - sinon, une valeur ACTIVE existe pour la locale par défaut → retenue,
 *   avec fallback explicite ;
 * - sinon → `null`. L'appelant retombe alors sur la valeur source du
 *   domaine concerné — hors périmètre de `localization`.
 */

export type LocalizedValueCandidate = {
  localeId: string;
  valueText: string;
  /** Statut Prisma `LocalizationValueStatus` ("DRAFT" | "ACTIVE" | "INACTIVE" | "ARCHIVED"). */
  status: string;
};

export type ResolveLocalizedValueInput = {
  /** Valeurs localisées existantes pour le (subjectType, subjectId, fieldName) visé. */
  candidates: readonly LocalizedValueCandidate[];
  /** Locale demandée (visiteur, admin, etc.). */
  requestedLocaleId: string;
  /** Locale par défaut du store — sert de fallback. */
  defaultLocaleId: string;
};

export type ResolvedLocalizedValue = {
  valueText: string;
  localeId: string;
  /** Vrai si la valeur retenue provient de la locale par défaut, pas de la locale demandée. */
  isFallback: boolean;
};

const ACTIVE_STATUS = "ACTIVE";

export function resolveLocalizedValue(
  input: ResolveLocalizedValueInput
): ResolvedLocalizedValue | null {
  const { candidates, requestedLocaleId, defaultLocaleId } = input;

  const active = candidates.filter((candidate) => candidate.status === ACTIVE_STATUS);

  const requested = active.find((candidate) => candidate.localeId === requestedLocaleId);

  if (requested !== undefined) {
    return { valueText: requested.valueText, localeId: requested.localeId, isFallback: false };
  }

  if (requestedLocaleId !== defaultLocaleId) {
    const fallback = active.find((candidate) => candidate.localeId === defaultLocaleId);

    if (fallback !== undefined) {
      return { valueText: fallback.valueText, localeId: fallback.localeId, isFallback: true };
    }
  }

  return null;
}
