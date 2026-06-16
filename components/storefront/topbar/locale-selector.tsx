import { headers } from "next/headers";

import { getLocaleSelectorState } from "@/features/localization/queries/get-locale-selector-state.query";

import { LocaleSelectorForm } from "./locale-selector-form";

/**
 * Lot 4 sous-lot 3 — `localization` L2 multilingual, sélecteur de langue
 * storefront (cf. docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Composant serveur : ne rend rien tant que `getLocaleSelectorState` ne
 * signale pas `isVisible: true` (flag `platform.localization` au niveau
 * `multilingual` + au moins deux locales actives). Reste invisible par
 * défaut (flag DRAFT) — zéro impact sur le layout storefront existant.
 *
 * Lot 5 sous-lot 3 — L3 `localized-routing` :
 * Lit `x-next-path-without-locale` depuis les headers (injecté par le
 * middleware) et le transmet au form pour que l'action puisse construire
 * l'URL de destination lors du changement de locale.
 */
export async function LocaleSelector() {
  const [state, headersList] = await Promise.all([
    getLocaleSelectorState(),
    headers(),
  ]);

  if (!state.isVisible) {
    return null;
  }

  const pathWithoutLocale = headersList.get("x-next-path-without-locale") ?? "/";

  return (
    <LocaleSelectorForm
      options={state.options}
      activeLocaleCode={state.activeLocaleCode}
      pathWithoutLocale={pathWithoutLocale}
    />
  );
}
