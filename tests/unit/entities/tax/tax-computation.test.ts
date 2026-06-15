import { describe, expect, it } from "vitest";

import {
  computeLineTaxFromGross,
  sumLineTax,
  TaxComputationError,
} from "@/entities/tax/tax-computation";

describe("computeLineTaxFromGross", () => {
  it("ventile un TTC rond au taux métropole 20 %", () => {
    expect(computeLineTaxFromGross(120, 20)).toEqual({
      grossAmount: 120,
      netAmount: 100,
      taxAmount: 20,
      ratePercent: 20,
    });
  });

  it("ventile un prix consommateur 19,99 € à 20 % (HT + TVA = TTC exact)", () => {
    const result = computeLineTaxFromGross(19.99, 20);
    expect(result.netAmount).toBe(16.66);
    expect(result.taxAmount).toBe(3.33);
    expect(result.netAmount + result.taxAmount).toBeCloseTo(19.99, 2);
  });

  it("applique le taux DOM 8,5 % (Antilles/Réunion)", () => {
    const result = computeLineTaxFromGross(100, 8.5);
    expect(result.netAmount).toBe(92.17);
    expect(result.taxAmount).toBe(7.83);
    expect(result.netAmount + result.taxAmount).toBeCloseTo(100, 2);
  });

  it("territoire exonéré (taux 0) : HT = TTC, TVA = 0", () => {
    expect(computeLineTaxFromGross(50, 0)).toEqual({
      grossAmount: 50,
      netAmount: 50,
      taxAmount: 0,
      ratePercent: 0,
    });
  });

  it("rejette un TTC négatif et un taux hors bornes", () => {
    expect(() => computeLineTaxFromGross(-1, 20)).toThrow(TaxComputationError);
    expect(() => computeLineTaxFromGross(100, -5)).toThrow(TaxComputationError);
    expect(() => computeLineTaxFromGross(100, 120)).toThrow(TaxComputationError);
    expect(() => computeLineTaxFromGross(Number.NaN, 20)).toThrow(TaxComputationError);
  });
});

describe("sumLineTax", () => {
  it("agrège les lignes en totaux cohérents", () => {
    const totals = sumLineTax([
      computeLineTaxFromGross(120, 20),
      computeLineTaxFromGross(100, 8.5),
    ]);
    expect(totals.grossAmount).toBe(220);
    expect(totals.netAmount).toBe(192.17);
    expect(totals.taxAmount).toBe(27.83);
    expect(totals.netAmount + totals.taxAmount).toBeCloseTo(totals.grossAmount, 2);
  });

  it("renvoie des zéros pour une liste vide", () => {
    expect(sumLineTax([])).toEqual({ grossAmount: 0, netAmount: 0, taxAmount: 0 });
  });
});
