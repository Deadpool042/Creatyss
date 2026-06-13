import { cookies } from "next/headers";

import { serverEnv } from "@/core/config/env/server";

/**
 * Préférence de locale visiteur (Horizon 4 — lot 4 sous-lot 3, « L2
 * multilingual — sélecteur de langue »).
 *
 * cf. docs/lots/2026-06-13-localization-l2-cadrage.md.
 *
 * Cookie simple (non signé) : la valeur est un code de locale en clair,
 * sans donnée sensible. Elle est systématiquement revalidée côté serveur
 * contre la liste des `LocalizationLocale` actives du store (cf.
 * `resolvePreferredLocaleCode`) — une valeur de cookie invalide ou obsolète
 * n'a donc aucun impact, elle est simplement ignorée au profit de la locale
 * par défaut.
 */

const LOCALE_PREFERENCE_COOKIE_NAME = "creatyss_locale";
const LOCALE_PREFERENCE_COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

export const localePreferenceCookieOptions = {
  httpOnly: false,
  maxAge: LOCALE_PREFERENCE_COOKIE_MAX_AGE,
  path: "/",
  sameSite: "lax" as const,
  secure: serverEnv.nodeEnv === "production",
};

/**
 * Lit la préférence de locale brute depuis le cookie visiteur, sans
 * validation. La validation contre les locales actives du store est à la
 * charge de l'appelant (cf. `resolvePreferredLocaleCode`).
 */
export async function readLocalePreferenceCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(LOCALE_PREFERENCE_COOKIE_NAME)?.value ?? null;
}

/**
 * Écrit la préférence de locale du visiteur. L'appelant doit avoir validé
 * `localeCode` au préalable (locale active du store).
 */
export async function writeLocalePreferenceCookie(localeCode: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_PREFERENCE_COOKIE_NAME, localeCode, localePreferenceCookieOptions);
}
