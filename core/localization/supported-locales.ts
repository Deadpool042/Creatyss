/**
 * Configuration locale Edge-safe — aucun import Prisma.
 *
 * Utilisée par `middleware.ts` pour identifier les préfixes de locale dans
 * les URLs storefront. Doit rester synchronisée avec les `LocalizationLocale`
 * actives du store (cf. prisma/seed/localization-locales.seed.ts).
 *
 * Décision L3 (2026-06-16) : locale par défaut (`fr`) non préfixée,
 * locales secondaires préfixées (`/en-GB/boutique`).
 * Référence : docs/lots/2026-06-13-localization-l3-cadrage.md.
 */

export const DEFAULT_LOCALE_CODE = "fr" as const;

/**
 * Codes des locales secondaires reconnues par le middleware comme préfixes
 * d'URL. Étendre cette liste lors de l'ajout d'une nouvelle locale active.
 */
export const SECONDARY_LOCALE_CODES = ["en-GB"] as const;

export type SecondaryLocaleCode = (typeof SECONDARY_LOCALE_CODES)[number];

/** Union de tous les codes supportés (défaut + secondaires). */
export const ALL_LOCALE_CODES = [DEFAULT_LOCALE_CODE, ...SECONDARY_LOCALE_CODES] as const;

export type LocaleCode = (typeof ALL_LOCALE_CODES)[number];
