import { describe, expect, it } from "vitest";

import { resolveLocaleContent } from "@/entities/languages/resolve-locale-content";

const DICTIONARIES = {
  fr: { title: "Titre" },
  en: { title: "Title" },
} as const;

describe("resolveLocaleContent", () => {
  it("retourne le dictionnaire de la locale par défaut sans locale demandée", () => {
    expect(
      resolveLocaleContent({ dictionaries: DICTIONARIES, defaultLocaleCode: "fr" })
    ).toBe(DICTIONARIES.fr);
  });

  it("retourne le dictionnaire de la locale demandée si présent", () => {
    expect(
      resolveLocaleContent({
        dictionaries: DICTIONARIES,
        defaultLocaleCode: "fr",
        requestedLocaleCode: "en",
      })
    ).toBe(DICTIONARIES.en);
  });

  it("retombe sur la locale par défaut si la locale demandée est absente", () => {
    expect(
      resolveLocaleContent({
        dictionaries: DICTIONARIES,
        defaultLocaleCode: "fr",
        requestedLocaleCode: "de",
      })
    ).toBe(DICTIONARIES.fr);
  });

  it("lève une erreur si le dictionnaire par défaut est absent", () => {
    expect(() =>
      resolveLocaleContent({ dictionaries: DICTIONARIES, defaultLocaleCode: "de" })
    ).toThrow(/aucun dictionnaire pour la locale par défaut/);
  });
});
