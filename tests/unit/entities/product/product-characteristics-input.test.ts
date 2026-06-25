import { describe, expect, it } from "vitest";
import { validateAdminProductCharacteristics } from "@/entities/product/admin-product-input";

describe("validateAdminProductCharacteristics", () => {
  it("accepte undefined et retourne une liste vide", () => {
    expect(validateAdminProductCharacteristics({ characteristics: undefined })).toEqual({
      ok: true,
      data: [],
    });
  });

  it("accepte une liste vide", () => {
    expect(validateAdminProductCharacteristics({ characteristics: [] })).toEqual({
      ok: true,
      data: [],
    });
  });

  it("valide une caractéristique nominale et assigne sortOrder 0", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "Matière", value: "Cuir pleine fleur" }],
    });

    expect(result).toEqual({
      ok: true,
      data: [{ label: "Matière", value: "Cuir pleine fleur", sortOrder: 0 }],
    });
  });

  it("assigne des sortOrder croissants à partir de 0", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [
        { label: "Matière", value: "Cuir" },
        { label: "Poids", value: "320 g" },
        { label: "Fermeture", value: "Magnétique" },
      ],
    });

    expect(result).toEqual({
      ok: true,
      data: [
        { label: "Matière", value: "Cuir", sortOrder: 0 },
        { label: "Poids", value: "320 g", sortOrder: 1 },
        { label: "Fermeture", value: "Magnétique", sortOrder: 2 },
      ],
    });
  });

  it("trim les espaces du label et de la valeur", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "  Matière  ", value: "  Cuir  " }],
    });

    expect(result).toEqual({
      ok: true,
      data: [{ label: "Matière", value: "Cuir", sortOrder: 0 }],
    });
  });

  it("rejette un label manquant (null)", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: null, value: "Cuir" }],
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid_characteristics",
      issues: [{ index: 0, field: "label", code: "missing_label" }],
    });
  });

  it("rejette un label vide (espaces uniquement)", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "   ", value: "Cuir" }],
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid_characteristics",
      issues: [{ index: 0, field: "label", code: "missing_label" }],
    });
  });

  it("rejette une valeur manquante (null)", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "Matière", value: null }],
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid_characteristics",
      issues: [{ index: 0, field: "value", code: "missing_value" }],
    });
  });

  it("rejette un label trop long (> 80 caractères)", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "A".repeat(81), value: "Cuir" }],
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid_characteristics",
      issues: [{ index: 0, field: "label", code: "label_too_long" }],
    });
  });

  it("accepte un label exactement à la limite (80 caractères)", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "A".repeat(80), value: "Cuir" }],
    });

    expect(result.ok).toBe(true);
  });

  it("rejette une valeur trop longue (> 220 caractères)", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "Matière", value: "B".repeat(221) }],
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid_characteristics",
      issues: [{ index: 0, field: "value", code: "value_too_long" }],
    });
  });

  it("accepte une valeur exactement à la limite (220 caractères)", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [{ label: "Matière", value: "B".repeat(220) }],
    });

    expect(result.ok).toBe(true);
  });

  it("remonte plusieurs issues sur des lignes différentes", () => {
    const result = validateAdminProductCharacteristics({
      characteristics: [
        { label: null, value: "Cuir" },
        { label: "Poids", value: null },
      ],
    });

    expect(result).toEqual({
      ok: false,
      code: "invalid_characteristics",
      issues: [
        { index: 0, field: "label", code: "missing_label" },
        { index: 1, field: "value", code: "missing_value" },
      ],
    });
  });

  it("accepte exactement 20 caractéristiques valides", () => {
    const characteristics = Array.from({ length: 20 }, (_, i) => ({
      label: `Label ${i}`,
      value: `Valeur ${i}`,
    }));

    const result = validateAdminProductCharacteristics({ characteristics });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(20);
      expect(result.data[19]!.sortOrder).toBe(19);
    }
  });

  it("rejette 21 caractéristiques valides avec too_many_characteristics et aucune issue de ligne", () => {
    const characteristics = Array.from({ length: 21 }, (_, i) => ({
      label: `Label ${i}`,
      value: `Valeur ${i}`,
    }));

    expect(validateAdminProductCharacteristics({ characteristics })).toEqual({
      ok: false,
      code: "too_many_characteristics",
      issues: [],
    });
  });
});
