import { describe, expect, it } from "vitest";

import {
  meetsRequiredLevel,
  resolveEffectiveLevel,
} from "@/entities/feature-flags/feature-level";

const LEVELS = ["basic", "assistant", "advanced", "automation"] as const;

describe("resolveEffectiveLevel", () => {
  it("retourne null pour une feature non graduée", () => {
    expect(
      resolveEffectiveLevel({ allowedLevels: [], defaultLevel: null, overrideLevel: null })
    ).toBeNull();
  });

  it("retourne le défaut sans override", () => {
    expect(
      resolveEffectiveLevel({ allowedLevels: LEVELS, defaultLevel: "basic" })
    ).toBe("basic");
  });

  it("l'override prime sur le défaut", () => {
    expect(
      resolveEffectiveLevel({
        allowedLevels: LEVELS,
        defaultLevel: "basic",
        overrideLevel: "advanced",
      })
    ).toBe("advanced");
  });

  it("rejette un niveau hors des niveaux autorisés (prudence)", () => {
    expect(
      resolveEffectiveLevel({
        allowedLevels: LEVELS,
        defaultLevel: "inexistant",
      })
    ).toBeNull();
  });

  it("retourne null sans défaut ni override", () => {
    expect(
      resolveEffectiveLevel({ allowedLevels: LEVELS, defaultLevel: null })
    ).toBeNull();
  });
});

describe("meetsRequiredLevel", () => {
  it("autorise au niveau exact", () => {
    expect(
      meetsRequiredLevel({
        allowedLevels: LEVELS,
        activeLevel: "assistant",
        requiredLevel: "assistant",
      })
    ).toBe(true);
  });

  it("autorise au-dessus du niveau requis", () => {
    expect(
      meetsRequiredLevel({
        allowedLevels: LEVELS,
        activeLevel: "automation",
        requiredLevel: "basic",
      })
    ).toBe(true);
  });

  it("bloque en dessous du niveau requis", () => {
    expect(
      meetsRequiredLevel({
        allowedLevels: LEVELS,
        activeLevel: "basic",
        requiredLevel: "advanced",
      })
    ).toBe(false);
  });

  it("bloque sans niveau actif", () => {
    expect(
      meetsRequiredLevel({ allowedLevels: LEVELS, activeLevel: null, requiredLevel: "basic" })
    ).toBe(false);
  });

  it("bloque sur niveau inconnu (actif ou requis)", () => {
    expect(
      meetsRequiredLevel({
        allowedLevels: LEVELS,
        activeLevel: "inexistant",
        requiredLevel: "basic",
      })
    ).toBe(false);
    expect(
      meetsRequiredLevel({
        allowedLevels: LEVELS,
        activeLevel: "basic",
        requiredLevel: "inexistant",
      })
    ).toBe(false);
  });
});
