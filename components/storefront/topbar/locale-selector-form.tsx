"use client";

import { useEffect, useState, type ChangeEvent } from "react";

import { setLocalePreferenceAction } from "@/features/localization/actions/set-locale-preference.action";
import type { LocaleSelectorOption } from "@/features/localization/queries/get-locale-selector-state.query";

/**
 * Lot 4 sous-lot 3 — `localization` L2 multilingual, sélecteur de langue
 * storefront (cf. docs/lots/2026-06-13-localization-l2-cadrage.md).
 *
 * Formulaire minimal : un `<select>` soumis via la server action
 * `setLocalePreferenceAction`. Soumission automatique au changement
 * (progressive : sans JS, le bouton reste disponible pour valider).
 */

type LocaleSelectorFormProps = Readonly<{
  options: readonly LocaleSelectorOption[];
  activeLocaleCode: string;
}>;

export function LocaleSelectorForm({ options, activeLocaleCode }: LocaleSelectorFormProps) {
  const [selectedLocaleCode, setSelectedLocaleCode] = useState(activeLocaleCode);

  useEffect(() => {
    setSelectedLocaleCode(activeLocaleCode);
  }, [activeLocaleCode]);

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedLocaleCode(event.currentTarget.value);
    event.currentTarget.form?.requestSubmit();
  }

  return (
    <form action={setLocalePreferenceAction} className="flex items-center">
      <label className="sr-only" htmlFor="locale-selector">
        Langue
      </label>

      <select
        id="locale-selector"
        name="localeCode"
        value={selectedLocaleCode}
        onChange={handleChange}
        className="h-9 rounded-full border border-shell-border bg-background/35 px-2 text-xs font-medium uppercase tracking-[0.04em] text-foreground"
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code}
          </option>
        ))}
      </select>

      <noscript>
        <button type="submit" className="sr-only">
          Changer de langue
        </button>
      </noscript>
    </form>
  );
}
