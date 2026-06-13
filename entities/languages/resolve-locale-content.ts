/**
 * Résolution pure du contenu localisé pour une feature (Horizon 4 — lot 3,
 * « convention copy unifiée »).
 *
 * cf. docs/lots/2026-06-12-localization-l1-cadrage.md (« Décision préalable
 * à trancher — convention de copy unique ») et
 * docs/domains/cross-cutting/localization.md.
 *
 * Convention : une config de feature (`features/<domaine>/config/*.config.ts`)
 * reste le CONTRAT — forme et clés du copy, consommées par les composants.
 * Son CONTENU est porté par des dictionnaires par locale
 * (`entities/languages/<locale>/<zone>/<feature>_<locale>.ts`). Cette
 * fonction résout le dictionnaire applicable : celui de la locale demandée
 * s'il existe, sinon celui de la locale par défaut.
 *
 * Avant l'activation du niveau `multilingual` de `platform.localization`,
 * une seule locale est servie (la locale par défaut) : la résolution est
 * alors constante, mais suit déjà le chemin qu'empruntera une future locale
 * secondaire — aucun second remaniement des composants à L2.
 */

export type LocaleContentDictionaries<T> = Readonly<Record<string, T>>;

export type ResolveLocaleContentInput<T> = {
  /** Dictionnaires de contenu disponibles, par code de locale. */
  dictionaries: LocaleContentDictionaries<T>;
  /** Code de la locale par défaut — doit toujours avoir un dictionnaire. */
  defaultLocaleCode: string;
  /** Locale demandée, le cas échéant (absente avant le niveau `multilingual`). */
  requestedLocaleCode?: string | null;
};

/**
 * Retourne le dictionnaire de la locale demandée s'il existe, sinon celui de
 * la locale par défaut. Lève une erreur si même le dictionnaire par défaut
 * est absent — configuration invalide, à corriger à la source.
 */
export function resolveLocaleContent<T>(input: ResolveLocaleContentInput<T>): T {
  const { dictionaries, defaultLocaleCode, requestedLocaleCode } = input;

  if (requestedLocaleCode !== null && requestedLocaleCode !== undefined) {
    const requested = dictionaries[requestedLocaleCode];

    if (requested !== undefined) {
      return requested;
    }
  }

  const fallback = dictionaries[defaultLocaleCode];

  if (fallback === undefined) {
    throw new Error(
      `resolveLocaleContent: aucun dictionnaire pour la locale par défaut "${defaultLocaleCode}"`
    );
  }

  return fallback;
}
