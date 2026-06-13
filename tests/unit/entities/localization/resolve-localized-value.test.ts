import { describe, expect, it } from "vitest";

import { resolveLocalizedValue } from "@/entities/localization/resolve-localized-value";

const FR = "locale-fr";
const EN = "locale-en";

describe("resolveLocalizedValue", () => {
  it("retourne la valeur ACTIVE de la locale demandée sans fallback", () => {
    const result = resolveLocalizedValue({
      candidates: [
        { localeId: EN, valueText: "Hello", status: "ACTIVE" },
        { localeId: FR, valueText: "Bonjour", status: "ACTIVE" },
      ],
      requestedLocaleId: EN,
      defaultLocaleId: FR,
    });

    expect(result).toEqual({ valueText: "Hello", localeId: EN, isFallback: false });
  });

  it("retombe sur la locale par défaut si la locale demandée n'a pas de valeur ACTIVE", () => {
    const result = resolveLocalizedValue({
      candidates: [{ localeId: FR, valueText: "Bonjour", status: "ACTIVE" }],
      requestedLocaleId: EN,
      defaultLocaleId: FR,
    });

    expect(result).toEqual({ valueText: "Bonjour", localeId: FR, isFallback: true });
  });

  it("ignore les valeurs non ACTIVE (DRAFT, INACTIVE, ARCHIVED)", () => {
    const result = resolveLocalizedValue({
      candidates: [
        { localeId: EN, valueText: "Draft hello", status: "DRAFT" },
        { localeId: FR, valueText: "Bonjour", status: "INACTIVE" },
      ],
      requestedLocaleId: EN,
      defaultLocaleId: FR,
    });

    expect(result).toBeNull();
  });

  it("retourne null si aucune valeur ACTIVE n'existe, même pour la locale par défaut", () => {
    const result = resolveLocalizedValue({
      candidates: [],
      requestedLocaleId: EN,
      defaultLocaleId: FR,
    });

    expect(result).toBeNull();
  });

  it("locale demandée = locale par défaut : pas de double tentative", () => {
    const result = resolveLocalizedValue({
      candidates: [{ localeId: FR, valueText: "Bonjour", status: "ACTIVE" }],
      requestedLocaleId: FR,
      defaultLocaleId: FR,
    });

    expect(result).toEqual({ valueText: "Bonjour", localeId: FR, isFallback: false });
  });
});
