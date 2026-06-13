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
 */
export async function LocaleSelector() {
  const state = await getLocaleSelectorState();

  if (!state.isVisible) {
    return null;
  }

  return <LocaleSelectorForm options={state.options} activeLocaleCode={state.activeLocaleCode} />;
}
