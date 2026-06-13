import { describe, expect, it } from "vitest";

import { resolvePreferredLocaleCode } from "@/entities/localization/resolve-preferred-locale";

const FR = "fr-FR";
const EN = "en-GB";

describe("resolvePreferredLocaleCode", () => {
  it("retourne la préférence du cookie si elle est disponible", () => {
    const result = resolvePreferredLocaleCode({
      availableLocaleCodes: [FR, EN],
      defaultLocaleCode: FR,
      cookieLocaleCode: EN,
    });

    expect(result).toBe(EN);
  });

  it("retombe sur la locale par défaut si aucun cookie n'est présent", () => {
    const result = resolvePreferredLocaleCode({
      availableLocaleCodes: [FR, EN],
      defaultLocaleCode: FR,
      cookieLocaleCode: null,
    });

    expect(result).toBe(FR);
  });

  it("retombe sur la locale par défaut si le cookie est absent (undefined)", () => {
    const result = resolvePreferredLocaleCode({
      availableLocaleCodes: [FR, EN],
      defaultLocaleCode: FR,
    });

    expect(result).toBe(FR);
  });

  it("retombe sur la locale par défaut si le cookie référence une locale non disponible", () => {
    const result = resolvePreferredLocaleCode({
      availableLocaleCodes: [FR, EN],
      defaultLocaleCode: FR,
      cookieLocaleCode: "de-DE",
    });

    expect(result).toBe(FR);
  });

  it("cookie = locale par défaut : retourne la locale par défaut", () => {
    const result = resolvePreferredLocaleCode({
      availableLocaleCodes: [FR, EN],
      defaultLocaleCode: FR,
      cookieLocaleCode: FR,
    });

    expect(result).toBe(FR);
  });
});
