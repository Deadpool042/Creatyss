/**
 * Résolution pure de la locale active pour un visiteur (Horizon 4 — lot 4
 * sous-lot 3, « L2 multilingual — sélecteur de langue »).
 *
 * cf. docs/lots/2026-06-13-localization-l2-cadrage.md.
 *
 * La préférence de locale est portée par un cookie visiteur (pas de
 * routing localisé — lot 5). Cette fonction décide quelle locale est
 * effectivement active : la préférence du cookie si elle correspond à une
 * locale gérée et disponible, sinon la locale par défaut du store.
 */

export type ResolvePreferredLocaleCodeInput = {
  /** Codes des locales gérées et disponibles (`LocalizationLocale.status === "ACTIVE"`). */
  availableLocaleCodes: readonly string[];
  /** Code de la locale par défaut du store — doit faire partie des locales disponibles. */
  defaultLocaleCode: string;
  /** Préférence lue depuis le cookie visiteur, le cas échéant. */
  cookieLocaleCode?: string | null;
};

/**
 * Retourne le code de la locale active : la préférence du cookie si elle
 * appartient aux locales disponibles, sinon la locale par défaut.
 */
export function resolvePreferredLocaleCode(input: ResolvePreferredLocaleCodeInput): string {
  const { availableLocaleCodes, defaultLocaleCode, cookieLocaleCode } = input;

  if (
    cookieLocaleCode !== null &&
    cookieLocaleCode !== undefined &&
    availableLocaleCodes.includes(cookieLocaleCode)
  ) {
    return cookieLocaleCode;
  }

  return defaultLocaleCode;
}
