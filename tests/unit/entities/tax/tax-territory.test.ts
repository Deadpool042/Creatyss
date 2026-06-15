import { describe, expect, it } from "vitest";

import {
  determineFrenchTaxTerritory,
  isVatExemptTerritory,
} from "@/entities/tax/tax-territory";

describe("determineFrenchTaxTerritory", () => {
  it("reconnaît la métropole (départements 01–95, Corse incluse)", () => {
    expect(determineFrenchTaxTerritory("75001")).toBe("METROPOLE");
    expect(determineFrenchTaxTerritory("01000")).toBe("METROPOLE");
    expect(determineFrenchTaxTerritory("95999")).toBe("METROPOLE");
    expect(determineFrenchTaxTerritory("20000")).toBe("METROPOLE");
  });

  it("reconnaît les DOM par préfixe 971–976", () => {
    expect(determineFrenchTaxTerritory("97110")).toBe("GUADELOUPE");
    expect(determineFrenchTaxTerritory("97200")).toBe("MARTINIQUE");
    expect(determineFrenchTaxTerritory("97300")).toBe("GUYANE");
    expect(determineFrenchTaxTerritory("97400")).toBe("REUNION");
    expect(determineFrenchTaxTerritory("97600")).toBe("MAYOTTE");
  });

  it("tolère les espaces autour du code postal", () => {
    expect(determineFrenchTaxTerritory("  97110  ")).toBe("GUADELOUPE");
  });

  it("renvoie null pour les COM/TOM hors champ V1 (975, 977/978, 98x)", () => {
    expect(determineFrenchTaxTerritory("97500")).toBeNull();
    expect(determineFrenchTaxTerritory("97700")).toBeNull();
    expect(determineFrenchTaxTerritory("98800")).toBeNull();
  });

  it("renvoie null pour un code postal invalide", () => {
    expect(determineFrenchTaxTerritory("1234")).toBeNull();
    expect(determineFrenchTaxTerritory("ABCDE")).toBeNull();
    expect(determineFrenchTaxTerritory("")).toBeNull();
  });
});

describe("isVatExemptTerritory", () => {
  it("Guyane et Mayotte sont exonérées", () => {
    expect(isVatExemptTerritory("GUYANE")).toBe(true);
    expect(isVatExemptTerritory("MAYOTTE")).toBe(true);
  });

  it("métropole et Antilles/Réunion ne le sont pas", () => {
    expect(isVatExemptTerritory("METROPOLE")).toBe(false);
    expect(isVatExemptTerritory("GUADELOUPE")).toBe(false);
    expect(isVatExemptTerritory("MARTINIQUE")).toBe(false);
    expect(isVatExemptTerritory("REUNION")).toBe(false);
  });
});
